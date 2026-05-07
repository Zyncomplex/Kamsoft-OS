import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createDto: CreateBrandDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('brands')
      .insert([createDto])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('brands')
      .select('*')
      .order('name');

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Brand with ID ${id} not found`);
    return data;
  }

  async update(id: string, updateDto: UpdateBrandDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('brands')
      .update(updateDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException(`Brand with ID ${id} not found`);
    return data;
  }
}
