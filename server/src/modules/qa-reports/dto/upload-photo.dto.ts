import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum PhotoType {
  Front = 'front',
  Back = 'back',
  Detail = 'detail',
  Defect = 'defect',
}

export class UploadPhotoDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(PhotoType)
  type: PhotoType;

  @IsString()
  @IsOptional()
  caption?: string;
}
