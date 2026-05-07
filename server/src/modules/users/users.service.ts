import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createDto: CreateUserDto) {
    const client = this.supabase.getClient();

    // Create auth user
    const { data: authData, error: authError } =
      await client.auth.admin.createUser({
        email: createDto.email,
        password: createDto.password || 'Kamsoft@2026', // default pass
        email_confirm: true,
      });

    if (authError) {
      throw new InternalServerErrorException(
        `Auth Error: ${authError.message}`,
      );
    }

    const userId = authData.user.id;

    // Create profile
    const activeBrand =
      createDto.active_brand_id ||
      (createDto.brand_ids.length > 0 ? createDto.brand_ids[0] : null);

    const { data: profile, error: profileError } = await client
      .from('profiles')
      .insert([
        {
          id: userId,
          full_name: createDto.full_name,
          role: createDto.role,
          brand_ids: createDto.brand_ids,
          active_brand_id: activeBrand,
        },
      ])
      .select()
      .single();

    if (profileError) {
      // Clean up auth user if profile fails
      await client.auth.admin.deleteUser(userId);
      throw new InternalServerErrorException(
        `Profile Error: ${profileError.message}`,
      );
    }

    return profile;
  }

  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`User with ID ${id} not found`);
    return data;
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const client = this.supabase.getClient();

    // If updating email or password, update auth user first
    if (updateDto.email || updateDto.password) {
      const authUpdates: any = {};
      if (updateDto.email) authUpdates.email = updateDto.email;
      if (updateDto.password) authUpdates.password = updateDto.password;

      const { error: authError } = await client.auth.admin.updateUserById(
        id,
        authUpdates,
      );
      if (authError) throw new InternalServerErrorException(authError.message);
    }

    // Update profile
    const profileUpdates: any = {};
    if (updateDto.full_name) profileUpdates.full_name = updateDto.full_name;
    if (updateDto.role) profileUpdates.role = updateDto.role;
    if (updateDto.brand_ids) profileUpdates.brand_ids = updateDto.brand_ids;
    if (updateDto.active_brand_id)
      profileUpdates.active_brand_id = updateDto.active_brand_id;

    if (Object.keys(profileUpdates).length > 0) {
      const { data, error } = await client
        .from('profiles')
        .update(profileUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new InternalServerErrorException(error.message);
      return data;
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const client = this.supabase.getClient();

    // Deleting from auth.users cascades to profiles table
    const { error } = await client.auth.admin.deleteUser(id);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { success: true };
  }
}
