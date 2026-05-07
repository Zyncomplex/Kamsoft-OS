import { IsUUID, IsOptional } from 'class-validator';

export class UpdateQaReportDto {
  @IsUUID()
  @IsOptional()
  inspector_id?: string;
}
