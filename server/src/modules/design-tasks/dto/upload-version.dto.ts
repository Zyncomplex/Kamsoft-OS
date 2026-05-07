import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadVersionDto {
  @IsString()
  @IsNotEmpty()
  file_url: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
