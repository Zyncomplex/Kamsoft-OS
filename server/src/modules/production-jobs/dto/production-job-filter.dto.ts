import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ProductionStatus } from '../../../types';

export class ProductionJobFilterDto extends PaginationDto {
  @IsEnum(ProductionStatus)
  @IsOptional()
  status?: ProductionStatus;

  @IsUUID()
  @IsOptional()
  assigned_to_id?: string;

  @IsUUID()
  @IsOptional()
  order_id?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}
