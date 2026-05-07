import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ShipmentStatus } from '../../../types';

export class ShipmentFilterDto extends PaginationDto {
  @IsEnum(ShipmentStatus)
  @IsOptional()
  status?: ShipmentStatus;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsUUID()
  @IsOptional()
  order_id?: string;
}
