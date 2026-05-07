import { PartialType } from '@nestjs/mapped-types';
import { CreateShipmentDto } from './create-shipment.dto';
import { ShipmentStatus } from '../../../types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
  @IsEnum(ShipmentStatus)
  @IsOptional()
  status?: ShipmentStatus;

  @IsString()
  @IsOptional()
  location?: string;
}
