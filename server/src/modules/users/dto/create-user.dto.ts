import { IsString, IsEmail, IsEnum, IsOptional, IsArray, IsUUID } from 'class-validator';
import { UserRole } from '../../../types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  full_name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsArray()
  @IsUUID(4, { each: true })
  brand_ids: string[];

  @IsUUID()
  @IsOptional()
  active_brand_id?: string;
}
