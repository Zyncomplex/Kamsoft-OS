import { BaseAdapter } from './base.adapter';

export class StripeAdapter extends BaseAdapter {
  type = 'stripe';
  name = 'Stripe';

  async disconnect(): Promise<void> {
    this.config = {};
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (this.config.secret_key) {
      return { ok: true, message: 'Stripe API key validated successfully (mock).' };
    }
    return { ok: false, message: 'Missing secret_key in config.' };
  }

  async createInvoice() { return this.notImplementedMessage('createInvoice'); }
  async capturePayment() { return this.notImplementedMessage('capturePayment'); }
  async getPaymentStatus() { return this.notImplementedMessage('getPaymentStatus'); }
  async createQuote() { return this.notImplementedMessage('createQuote'); }
}
