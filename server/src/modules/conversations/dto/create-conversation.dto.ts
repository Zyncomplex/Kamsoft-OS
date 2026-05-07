import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConversationChannel } from '../../../types';

export class CreateConversationDto {
  @IsUUID()
  @IsOptional()
  lead_id?: string;

  @IsUUID()
  @IsOptional()
  customer_id?: string;

  @IsEnum(ConversationChannel)
  @IsOptional()
  channel?: ConversationChannel;

  @IsString()
  @IsOptional()
  subject?: string;
}
