import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConversationDto {
  @IsBoolean()
  @IsOptional()
  is_resolved?: boolean;
}
