import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateChecklistDto {
  @IsArray()
  @IsNotEmpty()
  checklist: any[];
}
