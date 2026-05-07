import { IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateQaReportDto {
  @IsUUID()
  production_job_id: string;

  @IsArray()
  @IsOptional()
  checklist?: any[];
}
