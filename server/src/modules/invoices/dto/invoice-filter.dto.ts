import { IsEnum, IsOptional, IsBooleanString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { InvoiceStatus } from '../../../types';

export class InvoiceFilterDto extends PaginationDto {
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  // if true, filters where due_date < now and status != Paid
  @IsOptional()
  overdue?: boolean; 
}
