import { BaseAdapter } from './base.adapter';

export class UpsAdapter extends BaseAdapter {
  type = 'ups';
  name = 'UPS';

  async disconnect(): Promise<void> { this.config = {}; }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    return this.config.api_key ? { ok: true, message: 'UPS ok' } : { ok: false, message: 'Missing key' };
  }

  async createLabel() { return this.notImplementedMessage('createLabel'); }
  async getTracking() { return this.notImplementedMessage('getTracking'); }
  async getRates() { return this.notImplementedMessage('getRates'); }
}
