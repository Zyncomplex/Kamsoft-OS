import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createCustomerDto: CreateCustomerDto) {
    const client = this.supabase.getClient();

    const { data, error } = await client
      .from('customers')
      .insert([
        {
          ...createCustomerDto,
          brand_id: brandId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: CustomerFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.search) {
      query = query.or(
        `name.ilike.%${filterDto.search}%,email.ilike.%${filterDto.search}%,company.ilike.%${filterDto.search}%`,
      );
    }

    // Pagination
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

    // Fetch customer and their order history + invoices
    const { data, error } = await client
      .from('customers')
      .select(
        `
        *,
        orders (
          id, display_id, status, total, currency, created_at
        )
      `,
      )
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return data;
  }

  async update(
    brandId: string,
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const client = this.supabase.getClient();

    const { data, error } = await client
      .from('customers')
      .update(updateCustomerDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return data;
  }

  async merge(brandId: string, targetId: string, sourceId: string) {
    const client = this.supabase.getClient();

    // In a real scenario, we'd wrap this in a postgres function/rpc to ensure transactionality.
    // We would need to update customer_id in leads, quotes, orders, conversations, etc.
    const { error: rpcError } = await client.rpc('merge_customers', {
      p_brand_id: brandId,
      p_target_id: targetId,
      p_source_id: sourceId,
    });

    if (rpcError) {
      throw new InternalServerErrorException(rpcError.message);
    }

    return { message: 'Customers merged successfully' };
  }
}
