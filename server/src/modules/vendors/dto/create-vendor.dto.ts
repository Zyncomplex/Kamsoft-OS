import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  contact_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  capabilities?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
