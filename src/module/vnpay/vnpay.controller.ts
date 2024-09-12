import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { VNPayService } from './vnpay.service';

@Controller('vnpay')
export class VNPayController {
  constructor(private readonly vnpayService: VNPayService) {}

  @Get('callback')
  @Redirect()
  async handleVNPayCallback(@Query() query: any) {
    const redirectUrl = await this.vnpayService.handleCallback(query);
    return { url: redirectUrl };
  }
}
