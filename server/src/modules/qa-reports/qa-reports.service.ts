import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateQaReportDto } from './dto/create-qa-report.dto';
import { UpdateQaReportDto } from './dto/update-qa-report.dto';
import { QaReportFilterDto } from './dto/qa-report-filter.dto';
import { UploadPhotoDto, PhotoType } from './dto/upload-photo.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { QAStatus, ProductionStatus, OrderStatus, MessageSenderType } from '../../types';

@Injectable()
export class QaReportsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createDto: CreateQaReportDto) {
    const client = this.supabase.getClient();
    
    const defaultChecklist = [
      { item: 'Dimensions match spec', passed: null, notes: '' },
      { item: 'Color accuracy', passed: null, notes: '' },
      { item: 'Stitch density', passed: null, notes: '' },
      { item: 'Backing type correct', passed: null, notes: '' },
      { item: 'Border/edge quality', passed: null, notes: '' },
      { item: 'No loose threads', passed: null, notes: '' },
      { item: 'Overall finish quality', passed: null, notes: '' }
    ];

    const { data, error } = await client
      .from('qa_reports')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
          status: QAStatus.Pending,
          checklist: createDto.checklist || defaultChecklist,
          photos: [],
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: QaReportFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('qa_reports')
      .select('*, production_job:production_jobs(display_id)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.status) query = query.eq('status', filterDto.status);
    if (filterDto.inspector_id) query = query.eq('inspector_id', filterDto.inspector_id);
    if (filterDto.production_job_id) query = query.eq('production_job_id', filterDto.production_job_id);

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async findOne(brandId: string, id: string) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('qa_reports')
      .select(`
        *,
        production_job:production_jobs(
          *,
          order:orders(*)
        ),
        inspector:profiles!inspector_id(*)
      `)
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`QA Report with ID ${id} not found`);
    }

    return data;
  }

  async update(brandId: string, id: string, updateDto: UpdateQaReportDto) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('qa_reports')
      .update(updateDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    
    if (!data) {
      throw new NotFoundException(`QA Report with ID ${id} not found`);
    }

    return data;
  }

  async updateChecklist(brandId: string, id: string, updateDto: UpdateChecklistDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('qa_reports')
      .update({ checklist: updateDto.checklist })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async uploadPhoto(brandId: string, id: string, photoDto: UploadPhotoDto) {
    const client = this.supabase.getClient();
    const report = await this.findOne(brandId, id);

    const photos = [...(report.photos || []), photoDto];

    const { data, error } = await client
      .from('qa_reports')
      .update({ photos })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async submit(brandId: string, id: string) {
    const client = this.supabase.getClient();
    const report = await this.findOne(brandId, id);

    if (report.status !== QAStatus.Pending && report.status !== QAStatus.In_Progress) {
      throw new BadRequestException('Report is already submitted.');
    }

    // Validate minimum 2 photos
    if (!report.photos || report.photos.length < 2) {
      throw new BadRequestException('Minimum 2 photos (front and back) are required before submission.');
    }

    // Validate checklist items are all answered
    const checklist = report.checklist || [];
    const allAnswered = checklist.every((item: any) => item.passed === true || item.passed === false);
    if (!allAnswered) {
      throw new BadRequestException('All checklist items must be marked pass or fail.');
    }

    const hasFailure = checklist.some((item: any) => item.passed === false);

    if (hasFailure) {
      // Fail Flow
      await client.from('qa_reports').update({ status: QAStatus.Failed }).eq('id', id).eq('brand_id', brandId);
      
      // Update production job
      await client.from('production_jobs').update({ status: ProductionStatus.Queued }).eq('id', report.production_job_id).eq('brand_id', brandId);
      
      // Auto-notify SDR and Manager via system message in order thread
      const order = report.production_job.order;
      await this.postSystemMessage(brandId, order.customer_id, `QA Failed for order ${order.display_id}. Sent back to production queue for rework.`);
      
      return { status: QAStatus.Failed, message: 'QA failed. Rework initiated.' };
    } else {
      // Pass Flow
      await client.from('qa_reports').update({ status: QAStatus.Passed }).eq('id', id).eq('brand_id', brandId);
      
      await client.from('production_jobs').update({ status: ProductionStatus.Completed }).eq('id', report.production_job_id).eq('brand_id', brandId);
      
      const order = report.production_job.order;
      await client.from('orders').update({ status: OrderStatus.Shipping }).eq('id', order.id).eq('brand_id', brandId);
      
      await this.postSystemMessage(brandId, order.customer_id, `QA Passed for order ${order.display_id}. Order moved to Shipping.`);
      
      return { status: QAStatus.Passed, message: 'QA passed. Order moved to Shipping.' };
    }
  }

  private async postSystemMessage(brandId: string, customerId: string, body: string) {
    const client = this.supabase.getClient();
    const { data: conv } = await client
      .from('conversations')
      .select('id')
      .eq('customer_id', customerId)
      .eq('brand_id', brandId)
      .limit(1)
      .single();

    if (conv) {
      await client.from('messages').insert([{
        conversation_id: conv.id,
        sender_type: MessageSenderType.system,
        body
      }]);
    }
  }

  async getStats(brandId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('qa_reports')
      .select('status')
      .eq('brand_id', brandId);

    if (error) throw new InternalServerErrorException(error.message);

    const total = data.length;
    const passed = data.filter(r => r.status === QAStatus.Passed).length;
    const failed = data.filter(r => r.status === QAStatus.Failed).length;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total) * 100 : 0
    };
  }
}
