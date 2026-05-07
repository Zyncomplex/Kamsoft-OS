import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ConversationChannel } from '../../../types';

export class ConversationFilterDto extends PaginationDto {
  @IsEnum(ConversationChannel)
  @IsOptional()
  channel?: ConversationChannel;

  @IsOptional()
  is_resolved?: boolean;

  @IsUUID()
  @IsOptional()
  lead_id?: string;
}
