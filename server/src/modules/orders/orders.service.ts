import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { OrderStatus, MessageSenderType } from '../../types';

@Injectable()
export class OrdersService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createDto: CreateOrderDto) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('orders')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
          status: OrderStatus.Awaiting_Payment,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: OrderFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('orders')
      .select('*, customer:customers(name), quote:quotes(display_id)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.status) {
      query = query.eq('status', filterDto.status);
    }
    if (filterDto.customer_id) {
      query = query.eq('customer_id', filterDto.customer_id);
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
      .from('orders')
      .select(`
        *,
        order_items(*),
        quote:quotes(*),
        customer:customers(*),
        design_tasks(*),
        production_jobs(*),
        shipments(*)
      `)
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return data;
  }

  private validateStatusTransition(oldStatus: string, newStatus: string) {
    if (oldStatus === newStatus) return true;
    
    if (newStatus === OrderStatus.Cancelled) return true; // Can cancel anytime

    const flow = [
      OrderStatus.Awaiting_Payment,
      OrderStatus.Design,
      OrderStatus.Production,
      OrderStatus.QA,
      OrderStatus.Shipping,
      OrderStatus.Delivered
    ];

    const oldIndex = flow.indexOf(oldStatus as OrderStatus);
    const newIndex = flow.indexOf(newStatus as OrderStatus);

    if (oldIndex === -1 || newIndex === -1) {
      throw new BadRequestException(`Invalid status values.`);
    }

    // QA can go back to Production, otherwise it must go forward
    if (oldStatus === OrderStatus.QA && newStatus === OrderStatus.Production) {
      return true;
    }

    if (newIndex <= oldIndex) {
      throw new BadRequestException(`Cannot transition order status backwards from ${oldStatus} to ${newStatus}`);
    }
    
    // Check if skipping steps (Optional depending on business rules, usually allowed to skip if needed, but the prompt says transitions enforced)
    if (newIndex > oldIndex + 1 && newStatus !== OrderStatus.Delivered) {
      // allowing skip to delivered just in case, but let's be strict for others
      throw new BadRequestException(`Cannot skip order status steps. From ${oldStatus} to ${newStatus}`);
    }

    return true;
  }

  async update(brandId: string, id: string, updateDto: UpdateOrderDto) {
    const client = this.supabase.getClient();
    
    const order = await this.findOne(brandId, id);
    
    if (updateDto.status) {
      this.validateStatusTransition(order.status, updateDto.status);
    }

    const { data, error } = await client
      .from('orders')
      .update({
        ...updateDto,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // If status changed, post a system message
    if (updateDto.status && updateDto.status !== order.status) {
      await this.postSystemMessageForOrder(brandId, order.customer_id, order.display_id, updateDto.status);
    }

    return data;
  }

  private async postSystemMessageForOrder(brandId: string, customerId: string, orderDisplayId: string, newStatus: string) {
    const client = this.supabase.getClient();
    // Find a conversation for this customer
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
        body: `Order ${orderDisplayId} status has been updated to ${newStatus}.`
      }]);
    }
  }

  async clone(brandId: string, id: string) {
    const order = await this.findOne(brandId, id);
    
    const { id: _id, display_id: _displayId, created_at: _createdAt, updated_at: _updatedAt, status: _status, order_items, ...rest } = order;

    // Create the new order
    const { data: newOrder, error } = await this.supabase.getClient()
      .from('orders')
      .insert([
        {
          ...rest,
          status: OrderStatus.Awaiting_Payment,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // Clone order items
    if (order_items && order_items.length > 0) {
      const itemsToInsert = order_items.map((item: any) => {
        const { id: _itemId, order_id: _orderId, ...itemRest } = item;
        return { ...itemRest, order_id: newOrder.id };
      });
      await this.supabase.getClient().from('order_items').insert(itemsToInsert);
    }

    return newOrder;
  }

  async getStats(brandId: string) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('orders')
      .select('status, total')
      .eq('brand_id', brandId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    const stats = {
      total_revenue: 0,
      by_status: {} as Record<string, number>
    };

    for (const order of data) {
      stats.total_revenue += Number(order.total || 0);
      stats.by_status[order.status] = (stats.by_status[order.status] || 0) + 1;
    }

    return stats;
  }
}
