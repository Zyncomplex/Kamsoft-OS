import { IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsOptional()
  quote_id?: string;

  @IsUUID()
  @IsOptional()
  customer_id?: string;

  @IsObject()
  @IsOptional()
  specs?: Record<string, any>;
}
