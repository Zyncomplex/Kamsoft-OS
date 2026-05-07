import { BaseAdapter } from './base.adapter';

export class GmailAdapter extends BaseAdapter {
  type = 'gmail';
  name = 'Gmail';

  async disconnect(): Promise<void> {
    this.config = {};
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    return this.config.client_id
      ? { ok: true, message: 'Gmail ok' }
      : { ok: false, message: 'Missing client_id' };
  }

  async fetchInbox() {
    return this.notImplementedMessage('fetchInbox');
  }
  async sendEmail() {
    return this.notImplementedMessage('sendEmail');
  }
  async watchInbox() {
    return this.notImplementedMessage('watchInbox');
  }
}
