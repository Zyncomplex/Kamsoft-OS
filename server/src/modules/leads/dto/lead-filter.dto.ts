import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { LeadStatus, PriorityLevel } from '../../../types';

export class LeadFilterDto extends PaginationDto {
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsUUID()
  @IsOptional()
  assigned_sdr_id?: string;
}
