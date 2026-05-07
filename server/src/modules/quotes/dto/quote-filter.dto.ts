import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { QuoteStatus } from '../../../types';

export class QuoteFilterDto extends PaginationDto {
  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsUUID()
  @IsOptional()
  customer_id?: string;
}
