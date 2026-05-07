import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { InvoiceStatus, OrderStatus } from '../../types';

@Injectable()
export class InvoicesService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createDto: CreateInvoiceDto) {
    const client = this.supabase.getClient();

    // Check if order exists
    const { data: order, error: orderError } = await client
      .from('orders')
      .select('id, currency')
      .eq('id', createDto.order_id)
      .eq('brand_id', brandId)
      .single();

    if (orderError || !order) {
      throw new BadRequestException('Invalid order ID');
    }

    const { data, error } = await client
      .from('invoices')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
          currency: createDto.currency || order.currency || 'USD',
          status: InvoiceStatus.Draft,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: InvoiceFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('invoices')
      .select('*, order:orders(display_id, customer_id)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.status) {
      query = query.eq('status', filterDto.status);
    }

    // The overdue filter logic
    if (filterDto.overdue === true || String(filterDto.overdue) === 'true') {
      const now = new Date().toISOString();
      query = query.lt('due_date', now).neq('status', InvoiceStatus.Paid);
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
      .from('invoices')
      .select(
        `
        *,
        order:orders(
          *,
          customer:customers(*)
        )
      `,
      )
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return data;
  }

  async update(brandId: string, id: string, updateDto: UpdateInvoiceDto) {
    const client = this.supabase.getClient();

    const { data, error } = await client
      .from('invoices')
      .update(updateDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return data;
  }

  async markPaid(brandId: string, id: string) {
    const client = this.supabase.getClient();
    const invoice = await this.findOne(brandId, id);

    if (invoice.status === InvoiceStatus.Paid) {
      throw new BadRequestException('Invoice is already marked as paid');
    }

    const { data, error } = await client
      .from('invoices')
      .update({
        status: InvoiceStatus.Paid,
        paid_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // Auto-transition Order to Design
    if (invoice.order_id) {
      await client
        .from('orders')
        .update({ status: OrderStatus.Design })
        .eq('id', invoice.order_id)
        .eq('brand_id', brandId);
    }

    return data;
  }

  async syncStripe(brandId: string, id: string) {
    // Placeholder for future Stripe integration
    // In the future, this would fetch the invoice, then call Stripe API to create/update an invoice,
    // and store the returned stripe_invoice_id
    return { message: 'Stripe sync not yet implemented' };
  }

  async getOverdue(brandId: string) {
    return this.findAll(brandId, { overdue: true });
  }
}
