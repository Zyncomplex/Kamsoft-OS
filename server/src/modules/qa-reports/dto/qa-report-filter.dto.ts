import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { QAStatus } from '../../../types';

export class QaReportFilterDto extends PaginationDto {
  @IsEnum(QAStatus)
  @IsOptional()
  status?: QAStatus;

  @IsUUID()
  @IsOptional()
  inspector_id?: string;

  @IsUUID()
  @IsOptional()
  production_job_id?: string;
}
