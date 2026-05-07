import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { InvoiceStatus } from '../../../types';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;
}
