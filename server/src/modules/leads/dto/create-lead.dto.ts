import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ConversationChannel, PriorityLevel } from '../../../types';

export class CreateLeadDto {
  @IsUUID()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsEnum(ConversationChannel)
  @IsOptional()
  channel?: ConversationChannel;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsString()
  @IsOptional()
  notes?: string;
}
