import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignTaskDto } from './create-design-task.dto';
import { DesignStatus } from '../../../types';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateDesignTaskDto extends PartialType(CreateDesignTaskDto) {
  @IsEnum(DesignStatus)
  @IsOptional()
  status?: DesignStatus;

  @IsUUID()
  @IsOptional()
  designer_id?: string;
}
