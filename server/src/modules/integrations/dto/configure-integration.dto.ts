import { IsObject, IsNotEmpty } from 'class-validator';

export class ConfigureIntegrationDto {
  @IsObject()
  @IsNotEmpty()
  config: Record<string, any>;
}
