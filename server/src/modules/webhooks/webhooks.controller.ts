import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

// Webhooks don't use SupabaseAuthGuard because they are called by external services
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(200)
  handleStripe(@Headers() headers: any, @Body() body: any) {
    return this.webhooksService.handleStripe(headers, body);
  }

  @Post('shipping')
  @HttpCode(200)
  handleShipping(@Headers() headers: any, @Body() body: any) {
    return this.webhooksService.handleShipping(headers, body);
  }

  @Post('email')
  @HttpCode(200)
  handleEmail(@Headers() headers: any, @Body() body: any) {
    return this.webhooksService.handleEmail(headers, body);
  }

  @Post('chat')
  @HttpCode(200)
  handleChat(@Headers() headers: any, @Body() body: any) {
    return this.webhooksService.handleChat(headers, body);
  }
}
