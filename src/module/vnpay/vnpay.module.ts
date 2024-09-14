import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from '../sales/orders/orders.module';
import { VNPayController } from './vnpay.controller';
import { VNPayService } from './vnpay.service';

@Module({
  imports: [OrdersModule, ConfigModule],
  controllers: [VNPayController],
  providers: [VNPayService],
})
export class VnpayModule {}
