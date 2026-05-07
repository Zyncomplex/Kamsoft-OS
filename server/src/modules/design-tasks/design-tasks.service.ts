import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateDesignTaskDto } from './dto/create-design-task.dto';
import { UpdateDesignTaskDto } from './dto/update-design-task.dto';
import { DesignTaskFilterDto } from './dto/design-task-filter.dto';
import { UploadVersionDto } from './dto/upload-version.dto';
import { DesignStatus, OrderStatus, MessageSenderType } from '../../types';

@Injectable()
export class DesignTasksService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createDto: CreateDesignTaskDto) {
    const client = this.supabase.getClient();

    // Auto-create from order
    const { data, error } = await client
      .from('design_tasks')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
          status: DesignStatus.Pending,
          versions: [],
          current_version: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: DesignTaskFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('design_tasks')
      .select('*, order:orders(display_id)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.status) {
      query = query.eq('status', filterDto.status);
    }
    if (filterDto.designer_id) {
      query = query.eq('designer_id', filterDto.designer_id);
    }
    if (filterDto.order_id) {
      query = query.eq('order_id', filterDto.order_id);
    }

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
      .from('design_tasks')
      .select(
        `
        *,
        order:orders(*),
        designer:profiles!designer_id(full_name, avatar_url)
      `,
      )
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Design task with ID ${id} not found`);
    }

    return data;
  }

  async update(brandId: string, id: string, updateDto: UpdateDesignTaskDto) {
    const client = this.supabase.getClient();

    const { data, error } = await client
      .from('design_tasks')
      .update(updateDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Design task with ID ${id} not found`);
    }

    return data;
  }

  async uploadVersion(
    brandId: string,
    id: string,
    versionDto: UploadVersionDto,
  ) {
    const client = this.supabase.getClient();
    const task = await this.findOne(brandId, id);

    if (task.status === DesignStatus.Approved) {
      throw new BadRequestException(
        'Cannot upload versions to an approved design task.',
      );
    }

    const newVersionNum = (task.current_version || 0) + 1;
    const newVersion = {
      version: newVersionNum,
      ...versionDto,
      created_at: new Date().toISOString(),
    };

    const versions = [...(task.versions || []), newVersion];

    const { data, error } = await client
      .from('design_tasks')
      .update({
        versions,
        current_version: newVersionNum,
        status: DesignStatus.In_Progress,
      })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async getVersions(brandId: string, id: string) {
    const task = await this.findOne(brandId, id);
    return task.versions || [];
  }

  async getVersion(brandId: string, id: string, versionNum: number) {
    const versions = await this.getVersions(brandId, id);
    const version = versions.find((v: any) => v.version === versionNum);
    if (!version) {
      throw new NotFoundException(`Version ${versionNum} not found`);
    }
    return version;
  }

  async submitForApproval(brandId: string, id: string) {
    const task = await this.findOne(brandId, id);
    if (!task.versions || task.versions.length === 0) {
      throw new BadRequestException(
        'Cannot submit for approval without at least one version uploaded.',
      );
    }
    return this.update(brandId, id, { status: DesignStatus.Awaiting_Approval });
  }

  async approve(brandId: string, id: string) {
    const client = this.supabase.getClient();
    const task = await this.findOne(brandId, id);

    if (!task.versions || task.versions.length === 0) {
      throw new BadRequestException('No versions to approve.');
    }

    // Mark task approved
    const { data, error } = await client
      .from('design_tasks')
      .update({ status: DesignStatus.Approved })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);

    // Update order: append to artwork_files, transition status to Production
    const finalVersion = task.versions.find(
      (v: any) => v.version === task.current_version,
    );
    const order = task.order;
    const currentArtworkFiles = order.artwork_files || [];

    await client
      .from('orders')
      .update({
        status: OrderStatus.Production,
        artwork_files: [...currentArtworkFiles, finalVersion],
        updated_at: new Date().toISOString(),
      })
      .eq('id', task.order_id)
      .eq('brand_id', brandId);

    // Auto system msg for transition already happens via orders.service if we were calling it,
    // but doing it directly via DB won't trigger nestjs orders.service logic.
    // We will post a system message manually here.
    await this.postSystemMessage(
      brandId,
      order.customer_id,
      `Design for order ${order.display_id} approved. Order moved to Production.`,
    );

    return data;
  }

  async requestRevision(brandId: string, id: string, feedback: string) {
    const client = this.supabase.getClient();
    const task = await this.findOne(brandId, id);

    if (task.status === DesignStatus.Approved) {
      throw new BadRequestException(
        'Cannot request revision on an approved design.',
      );
    }

    const { data, error } = await client
      .from('design_tasks')
      .update({
        status: DesignStatus.Revision,
        customer_feedback: feedback,
      })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);

    // Post system message
    await this.postSystemMessage(
      brandId,
      task.order.customer_id,
      `Revision requested for order ${task.order.display_id}: ${feedback}`,
    );

    return data;
  }

  private async postSystemMessage(
    brandId: string,
    customerId: string,
    body: string,
  ) {
    const client = this.supabase.getClient();
    const { data: conv } = await client
      .from('conversations')
      .select('id')
      .eq('customer_id', customerId)
      .eq('brand_id', brandId)
      .limit(1)
      .single();

    if (conv) {
      await client.from('messages').insert([
        {
          conversation_id: conv.id,
          sender_type: MessageSenderType.system,
          body,
        },
      ]);
    }
  }
}
