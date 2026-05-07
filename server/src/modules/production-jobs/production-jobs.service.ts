import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateProductionJobDto } from './dto/create-production-job.dto';
import { UpdateProductionJobDto } from './dto/update-production-job.dto';
import { ProductionJobFilterDto } from './dto/production-job-filter.dto';
import { ProductionStatus, QAStatus } from '../../types';

@Injectable()
export class ProductionJobsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createDto: CreateProductionJobDto) {
    const client = this.supabase.getClient();

    // Fetch order to get specs and design file
    const { data: order, error: orderError } = await client
      .from('orders')
      .select('specs, artwork_files, order_items(quantity)')
      .eq('id', createDto.order_id)
      .eq('brand_id', brandId)
      .single();

    if (orderError || !order) {
      throw new BadRequestException('Order not found or invalid');
    }

    const designFileUrl =
      order.artwork_files && order.artwork_files.length > 0
        ? order.artwork_files[order.artwork_files.length - 1].file_url
        : null;

    const totalQuantity = order.order_items.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );

    const { data, error } = await client
      .from('production_jobs')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
          status: ProductionStatus.Queued,
          specs: order.specs,
          design_file_url: designFileUrl,
          quantity: totalQuantity,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: ProductionJobFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('production_jobs')
      .select(
        '*, order:orders(display_id), assigned_to:profiles!assigned_to_id(full_name)',
        { count: 'exact' },
      )
      .eq('brand_id', brandId);

    if (filterDto.status) query = query.eq('status', filterDto.status);
    if (filterDto.assigned_to_id)
      query = query.eq('assigned_to_id', filterDto.assigned_to_id);
    if (filterDto.order_id) query = query.eq('order_id', filterDto.order_id);
    if (filterDto.due_date) query = query.eq('due_date', filterDto.due_date);

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
      .from('production_jobs')
      .select(
        `
        *,
        order:orders(*),
        assigned_to:profiles!assigned_to_id(*),
        qa_reports(*)
      `,
      )
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Production job with ID ${id} not found`);
    }

    return data;
  }

  async update(brandId: string, id: string, updateDto: UpdateProductionJobDto) {
    const client = this.supabase.getClient();
    const job = await this.findOne(brandId, id);

    const { data, error } = await client
      .from('production_jobs')
      .update(updateDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // Status transition triggers
    if (updateDto.status && updateDto.status !== job.status) {
      if (updateDto.status === ProductionStatus.Shipped_To_QA) {
        // Auto-create QA Report
        const defaultChecklist = [
          { item: 'Dimensions match spec', passed: null, notes: '' },
          { item: 'Color accuracy', passed: null, notes: '' },
          { item: 'Stitch density', passed: null, notes: '' },
          { item: 'Backing type correct', passed: null, notes: '' },
          { item: 'Border/edge quality', passed: null, notes: '' },
          { item: 'No loose threads', passed: null, notes: '' },
          { item: 'Overall finish quality', passed: null, notes: '' },
        ];

        await client.from('qa_reports').insert([
          {
            brand_id: brandId,
            production_job_id: id,
            status: QAStatus.Pending,
            checklist: defaultChecklist,
          },
        ]);
      }
    }

    return data;
  }

  async getBoard(brandId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('production_jobs')
      .select(
        '*, order:orders(display_id), assigned_to:profiles!assigned_to_id(full_name, avatar_url)',
      )
      .eq('brand_id', brandId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // Group by status
    const board = Object.values(ProductionStatus).reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<string, any[]>,
    );

    for (const job of data) {
      if (board[job.status]) {
        board[job.status].push(job);
      }
    }

    return board;
  }
}
