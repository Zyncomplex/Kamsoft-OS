import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CustomerFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string; // Search by name, email, or company
}
