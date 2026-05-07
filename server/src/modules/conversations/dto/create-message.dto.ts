import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { MessageSenderType } from '../../../types';

export class CreateMessageDto {
  @IsEnum(MessageSenderType)
  @IsNotEmpty()
  sender_type: MessageSenderType;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  attachments?: any[]; // [{url, name, size, type}]
}
