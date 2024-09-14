import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../sales/orders/orders.service';

@Injectable()
export class VNPayService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {}

  // Hàm xử lý callback VNPay
  async handleCallback(query: any): Promise<string> {
    const secretKey = this.configService.get<string>('VNP_HASH_SECRET');
    const { vnp_SecureHash, ...vnpParams } = query;

    // Sắp xếp các tham số trả về từ VNPay theo thứ tự alphabet
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .map((key) => `${key}=${vnpParams[key]}`)
      .join('&');

    // Tạo secure hash để kiểm tra
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac
      .update(Buffer.from(sortedParams, 'utf-8'))
      .digest('hex');

    // Xác thực chữ ký bảo mật
    if (vnp_SecureHash !== signed) {
      throw new BadRequestException('Invalid secure hash');
    }

    // Kiểm tra trạng thái thanh toán
    if (vnpParams.vnp_ResponseCode === '00') {
      // Thanh toán thành công
      const orderId = vnpParams.vnp_TxnRef;
      const amount = vnpParams.vnp_Amount / 100; // Lấy số tiền và chia cho 100 để khớp với số tiền thực tế
      await this.ordersService.updateOrderPaymentStatus(orderId, true, amount);

      // Trả về link thành công
      return (
        this.configService.get<string>('SUCCESS_URL') || '/payment-success'
      );
    } else {
      // Thanh toán thất bại
      const orderId = vnpParams.vnp_TxnRef;
      await this.ordersService.updateOrderPaymentStatus(orderId, false);

      // Trả về link thất bại
      return this.configService.get<string>('FAIL_URL') || '/payment-fail';
    }
  }
}
