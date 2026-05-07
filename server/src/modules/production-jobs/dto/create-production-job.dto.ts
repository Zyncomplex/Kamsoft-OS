import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateProductionJobDto {
  @IsUUID()
  order_id: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}
