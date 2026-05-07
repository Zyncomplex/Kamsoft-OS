import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationAdapterFactory } from './integrations.factory';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationAdapterFactory],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
