import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ActivityLogFilterDto extends PaginationDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  entity_type?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  end_date?: string;
}
