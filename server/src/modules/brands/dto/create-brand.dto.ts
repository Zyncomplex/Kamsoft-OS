import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
