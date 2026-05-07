import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateQuoteDto, QuoteItemDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteFilterDto } from './dto/quote-filter.dto';
import { QuoteStatus, OrderStatus } from '../../types';

@Injectable()
export class QuotesService {
  constructor(private readonly supabase: SupabaseService) {}

  validateQuoteItems(items: QuoteItemDto[]) {
    const warnings: string[] = [];
    
    for (const item of items) {
      if (item.patch_type?.toLowerCase() === 'pvc' && item.backing?.toLowerCase() === 'iron-on') {
        warnings.push('Heat risk: PVC patches should not typically use iron-on backing.');
      }
      if (item.patch_type?.toLowerCase() === 'leather' && item.backing?.toLowerCase() === 'merrow') {
        throw new BadRequestException('Invalid combo: Leather patches cannot have merrow borders.');
      }
      
      // Try to parse dimensions like "4x4" or "4 inches" to find if > 12in
      const sizeMatch = item.size?.match(/(\d+)/);
      if (sizeMatch && parseInt(sizeMatch[1], 10) > 12) {
        warnings.push('Oversized: Dimension exceeds 12 inches.');
      }
      
      if (item.colors > 15) {
        warnings.push('High thread count: Over 15 colors may cause production delays or issues.');
      }
    }
    
    return warnings;
  }

  calculateTotals(items: QuoteItemDto[]) {
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.quantity * item.unit_price;
    }
    const tax = subtotal * 0.1; // Default 10% tax for example, or based on brand settings
    const total = subtotal + tax;
    
    return {
      subtotal,
      tax,
      total,
      currency: 'USD' // Usually pulled from brand config
    };
  }

  async create(brandId: string, createQuoteDto: CreateQuoteDto) {
    const client = this.supabase.getClient();
    
    let warnings: string[] = [];
    let totals = { subtotal: 0, tax: 0, total: 0 };
    
    if (createQuoteDto.items && createQuoteDto.items.length > 0) {
      warnings = this.validateQuoteItems(createQuoteDto.items);
      totals = this.calculateTotals(createQuoteDto.items);
    }
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // 30 days validity

    const { data, error } = await client
      .from('quotes')
      .insert([
        {
          ...createQuoteDto,
          brand_id: brandId,
          ...totals,
          valid_until: validUntil.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { ...data, warnings };
  }

  async findAll(brandId: string, filterDto: QuoteFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('quotes')
      .select('*, customer:customers(name), lead:leads(display_id)', { count: 'exact' })
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
      .from('quotes')
      .select(`
        *,
        customer:customers(*),
        lead:leads(*)
      `)
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    return data;
  }

  async update(brandId: string, id: string, updateQuoteDto: UpdateQuoteDto) {
    const quote = await this.findOne(brandId, id);
    if (quote.status !== QuoteStatus.Draft) {
      throw new BadRequestException('Only Draft quotes can be modified.');
    }

    let warnings: string[] = [];
    let totals = { subtotal: quote.subtotal, tax: quote.tax, total: quote.total };

    if (updateQuoteDto.items) {
      warnings = this.validateQuoteItems(updateQuoteDto.items);
      totals = this.calculateTotals(updateQuoteDto.items);
    }

    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('quotes')
      .update({
        ...updateQuoteDto,
        ...totals,
      })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { ...data, warnings };
  }

  async updateStatus(brandId: string, id: string, status: QuoteStatus) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('quotes')
      .update({ status })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    
    return data;
  }

  async accept(brandId: string, id: string) {
    const client = this.supabase.getClient();
    
    // First get the quote
    const quote = await this.findOne(brandId, id);
    if (quote.status === QuoteStatus.Accepted) {
      throw new BadRequestException('Quote is already accepted');
    }

    // Mark as accepted
    await this.updateStatus(brandId, id, QuoteStatus.Accepted);

    // Auto-create Order
    // The postgres trigger set_orders_display_id will give it a display_id automatically
    const { data: order, error: orderError } = await client
      .from('orders')
      .insert([
        {
          brand_id: brandId,
          quote_id: quote.id,
          customer_id: quote.customer_id,
          status: OrderStatus.Awaiting_Payment,
          total: quote.total,
          currency: quote.currency,
        }
      ])
      .select()
      .single();

    if (orderError) {
      throw new InternalServerErrorException('Failed to create order: ' + orderError.message);
    }

    // Insert order items
    if (quote.items && quote.items.length > 0) {
      const orderItems = quote.items.map((item: any) => ({
        ...item,
        order_id: order.id
      }));

      await client.from('order_items').insert(orderItems);
    }

    return { message: 'Quote accepted and Order created', order };
  }

  async reject(brandId: string, id: string, reason: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('quotes')
      .update({ status: QuoteStatus.Rejected, notes: reason })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async clone(brandId: string, id: string) {
    const quote = await this.findOne(brandId, id);
    
    // Remove specific IDs to clone properly
    const { id: _id, display_id: _displayId, created_at: _createdAt, status: _status, ...rest } = quote;

    return this.create(brandId, {
      ...rest,
      notes: (rest.notes || '') + '\n(Cloned from ' + quote.display_id + ')'
    });
  }
}
