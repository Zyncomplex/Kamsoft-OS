import { BaseAdapter } from './base.adapter';

export class FedexAdapter extends BaseAdapter {
  type = 'fedex';
  name = 'FedEx';

  async disconnect(): Promise<void> {
    this.config = {};
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (this.config.api_key) {
      return {
        ok: true,
        message: 'FedEx API key validated successfully (mock).',
      };
    }
    return { ok: false, message: 'Missing api_key in config.' };
  }

  async createLabel() {
    return this.notImplementedMessage('createLabel');
  }
  async getTracking() {
    return this.notImplementedMessage('getTracking');
  }
  async getRates() {
    return this.notImplementedMessage('getRates');
  }
}
