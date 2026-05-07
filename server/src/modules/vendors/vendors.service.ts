import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createVendorDto: CreateVendorDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('vendors')
      .insert([{ ...createVendorDto, brand_id: brandId }])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findAll(brandId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('vendors')
      .select('*')
      .eq('brand_id', brandId)
      .order('name', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(brandId: string, id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('vendors')
      .select('*')
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) throw new NotFoundException(`Vendor with ID ${id} not found`);
    return data;
  }

  async update(brandId: string, id: string, updateVendorDto: UpdateVendorDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('vendors')
      .update(updateVendorDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async getRankings(brandId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('vendors')
      .select('id, name, rating, on_time_rate, defect_rate, total_jobs')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
