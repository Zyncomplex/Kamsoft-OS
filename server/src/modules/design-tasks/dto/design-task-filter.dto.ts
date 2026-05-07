import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { DesignStatus } from '../../../types';

export class DesignTaskFilterDto extends PaginationDto {
  @IsEnum(DesignStatus)
  @IsOptional()
  status?: DesignStatus;

  @IsUUID()
  @IsOptional()
  designer_id?: string;

  @IsUUID()
  @IsOptional()
  order_id?: string;
}
