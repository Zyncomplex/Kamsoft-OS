import { Injectable } from '@nestjs/common';
import { IntegrationsService } from '../integrations/integrations.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly integrations: IntegrationsService) {}

  async handleStripe(headers: any, body: any) {
    // In future: verify signature, fetch brand_id from metadata, load adapter
    return {
      received: true,
      processed: false,
      reason: 'adapter not configured',
    };
  }

  async handleShipping(headers: any, body: any) {
    // In future: verify signature, identify carrier, load adapter
    return {
      received: true,
      processed: false,
      reason: 'adapter not configured',
    };
  }

  async handleEmail(headers: any, body: any) {
    // In future: verify signature, load gmail adapter
    return {
      received: true,
      processed: false,
      reason: 'adapter not configured',
    };
  }

  async handleChat(headers: any, body: any) {
    // In future: verify signature, load tawkto adapter
    return {
      received: true,
      processed: false,
      reason: 'adapter not configured',
    };
  }
}
