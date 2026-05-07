import { IsUUID } from 'class-validator';

export class CreateDesignTaskDto {
  @IsUUID()
  order_id: string;
}
