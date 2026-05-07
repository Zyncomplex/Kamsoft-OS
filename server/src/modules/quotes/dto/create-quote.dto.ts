import { IsUUID, IsOptional, IsArray, IsString } from 'class-validator';

export class QuoteItemDto {
  @IsString()
  patch_type: string;

  @IsString()
  size: string;

  @IsString()
  backing: string;

  colors: number;

  @IsArray()
  @IsOptional()
  effects?: string[];

  quantity: number;

  unit_price: number;
}

export class CreateQuoteDto {
  @IsUUID()
  @IsOptional()
  lead_id?: string;

  @IsUUID()
  @IsOptional()
  customer_id?: string;

  @IsArray()
  @IsOptional()
  items?: QuoteItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}
