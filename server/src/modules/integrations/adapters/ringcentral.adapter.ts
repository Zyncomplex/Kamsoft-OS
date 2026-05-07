import { BaseAdapter } from './base.adapter';

export class RingCentralAdapter extends BaseAdapter {
  type = 'ringcentral';
  name = 'RingCentral';

  async disconnect(): Promise<void> {
    this.config = {};
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    return this.config.api_key
      ? { ok: true, message: 'RingCentral ok' }
      : { ok: false, message: 'Missing key' };
  }

  async getCallLog() {
    return this.notImplementedMessage('getCallLog');
  }
  async makeCall() {
    return this.notImplementedMessage('makeCall');
  }
  async getRecording() {
    return this.notImplementedMessage('getRecording');
  }
}
