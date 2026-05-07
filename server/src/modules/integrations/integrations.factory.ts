import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseAdapter } from './adapters/base.adapter';
import { StripeAdapter } from './adapters/stripe.adapter';
import { FedexAdapter } from './adapters/fedex.adapter';
import { DhlAdapter } from './adapters/dhl.adapter';
import { UpsAdapter } from './adapters/ups.adapter';
import { RingCentralAdapter } from './adapters/ringcentral.adapter';
import { GmailAdapter } from './adapters/gmail.adapter';
import { TawkToAdapter } from './adapters/tawkto.adapter';

@Injectable()
export class IntegrationAdapterFactory {
  private readonly adapters = new Map<string, any>([
    ['stripe', StripeAdapter],
    ['fedex', FedexAdapter],
    ['dhl', DhlAdapter],
    ['ups', UpsAdapter],
    ['ringcentral', RingCentralAdapter],
    ['gmail', GmailAdapter],
    ['tawkto', TawkToAdapter],
  ]);

  getAdapter(type: string): BaseAdapter {
    const AdapterClass = this.adapters.get(type.toLowerCase());
    if (!AdapterClass) {
      throw new NotFoundException(`Adapter type ${type} is not supported.`);
    }
    return new AdapterClass();
  }

  getAllSupportedTypes(): string[] {
    return Array.from(this.adapters.keys());
  }
}
