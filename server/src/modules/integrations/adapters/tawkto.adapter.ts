import { BaseAdapter } from './base.adapter';

export class TawkToAdapter extends BaseAdapter {
  type = 'tawkto';
  name = 'TawkTo';

  async disconnect(): Promise<void> { this.config = {}; }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    return this.config.api_key ? { ok: true, message: 'TawkTo ok' } : { ok: false, message: 'Missing api_key' };
  }

  async getChatTranscripts() { return this.notImplementedMessage('getChatTranscripts'); }
  async sendMessage() { return this.notImplementedMessage('sendMessage'); }
}
