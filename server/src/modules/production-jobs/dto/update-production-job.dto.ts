import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionJobDto } from './create-production-job.dto';
import { ProductionStatus } from '../../../types';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateProductionJobDto extends PartialType(
  CreateProductionJobDto,
) {
  @IsEnum(ProductionStatus)
  @IsOptional()
  status?: ProductionStatus;

  @IsUUID()
  @IsOptional()
  assigned_to_id?: string;
}
