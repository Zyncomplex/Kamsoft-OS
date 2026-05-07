import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { ActivityLogFilterDto } from './dto/activity-log-filter.dto';

@Injectable()
export class ActivityLogService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(brandId: string, filterDto: ActivityLogFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('activity_log')
      .select('*, user:profiles!user_id(full_name)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.user_id) query = query.eq('user_id', filterDto.user_id);
    if (filterDto.entity_type) query = query.eq('entity_type', filterDto.entity_type);
    if (filterDto.action) query = query.eq('action', filterDto.action);
    if (filterDto.start_date) query = query.gte('created_at', filterDto.start_date);
    if (filterDto.end_date) query = query.lte('created_at', filterDto.end_date);

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new InternalServerErrorException(error.message);

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

  async findByUser(brandId: string, userId: string, filterDto: ActivityLogFilterDto) {
    return this.findAll(brandId, { ...filterDto, user_id: userId });
  }

  async findByEntity(brandId: string, type: string, id: string, filterDto: ActivityLogFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('activity_log')
      .select('*, user:profiles!user_id(full_name)', { count: 'exact' })
      .eq('brand_id', brandId)
      .eq('entity_type', type)
      .eq('entity_id', id);

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw new InternalServerErrorException(error.message);

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

  // Used by interceptor
  async logAction(brandId: string, userId: string, action: string, entityType: string, entityId: string, details: any) {
    if (!brandId || !action) return;
    
    const client = this.supabase.getClient();
    await client.from('activity_log').insert([{
      brand_id: brandId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details
    }]);
  }
}
