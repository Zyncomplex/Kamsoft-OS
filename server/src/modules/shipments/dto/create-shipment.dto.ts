import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateShipmentDto {
  @IsUUID()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  carrier: string;

  @IsString()
  @IsOptional()
  tracking_number?: string;
}
