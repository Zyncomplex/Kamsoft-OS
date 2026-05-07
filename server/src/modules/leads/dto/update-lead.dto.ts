import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { LeadStatus } from '../../../types';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsUUID()
  @IsOptional()
  assigned_sdr_id?: string;
}
