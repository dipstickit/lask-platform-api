import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Order } from './models/order.entity';
import { OrderCreateDto } from './dto/order-create.dto';
import { UsersService } from '../../users/users.service';
import { ProductsService } from '../../catalog/products/products.service';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderItem } from './models/order-item.entity';
import { OrderDelivery } from './models/order-delivery.entity';
import { DeliveryMethodsService } from '../delivery-methods/delivery-methods.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { OrderPayment } from './models/order-payment.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { Role } from '../../users/models/role.enum';
import { OrderItemDto } from './dto/order-item.dto';
import { formatDate, sortObject } from '../../../utils/common';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly deliveryMethodsService: DeliveryMethodsService,
    private readonly paymentMethodsService: PaymentMethodsService,
    private readonly configService: ConfigService,
  ) {}

  async getOrders(withUser = false, withProducts = false): Promise<Order[]> {
    const relations = ['items', 'delivery', 'payment', 'return'];
    if (withUser) relations.unshift('user');
    if (withProducts) relations.push('items.product');
    return this.ordersRepository.find({ relations });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: [
        'user',
        'items',
        'items.product',
        'delivery',
        'payment',
        'return',
      ],
    });
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'user',
        'items',
        'items.product',
        'delivery',
        'payment',
        'return',
      ],
    });
    if (!order) {
      throw new NotFoundError('order', 'id', id.toString());
    }
    return order;
  }

  async checkOrderUser(userId: number, id: number): Promise<boolean> {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    return !!order;
  }

  async createOrder(
    userId: number | null,
    orderData: OrderCreateDto,
    ignoreSubscribers = false,
  ): Promise<Order> {
    const order = new Order();
    if (userId) {
      order.user = await this.usersService.getUser(userId);
    }
    order.items = await this.getItems(order, orderData.items);
    Object.assign(order, orderData);

    const deliveryMethod = await this.deliveryMethodsService.getMethod(
      orderData.delivery.methodId,
    );
    order.delivery = Object.assign(new OrderDelivery(), orderData.delivery, {
      method: deliveryMethod,
    });

    const paymentMethod = await this.paymentMethodsService.getMethod(
      orderData.payment.methodId,
    );
    order.payment = Object.assign(new OrderPayment(), orderData.payment, {
      method: paymentMethod,
    });

    return this.ordersRepository.save(order, { listeners: !ignoreSubscribers });
  }

  private async getItems(
    order: Order,
    items: OrderItemDto[],
  ): Promise<OrderItem[]> {
    return Promise.all(
      items.map(async (item) => {
        const product = await this.productsService.getProduct(
          item.productId,
          order.user &&
            [Role.Admin, Role.Manager, Role.Sales].includes(order.user.role),
        );
        return {
          product,
          quantity: item.quantity,
          price: product.price,
        } as OrderItem;
      }),
    );
  }

  async updateOrder(
    id: number,
    orderData: OrderUpdateDto,
    ignoreSubscribers = false,
  ): Promise<Order> {
    const order = await this.getOrder(id);
    if (orderData.items) {
      order.items = await this.getItems(order, orderData.items);
    }
    if (orderData.delivery) {
      const deliveryMethod = await this.deliveryMethodsService.getMethod(
        orderData.delivery.methodId,
      );
      Object.assign(order.delivery, orderData.delivery, {
        method: deliveryMethod,
      });
    }
    if (orderData.payment) {
      const paymentMethod = await this.paymentMethodsService.getMethod(
        orderData.payment.methodId,
      );
      Object.assign(order.payment, orderData.payment, {
        method: paymentMethod,
      });
    }
    const { delivery, payment, items, ...toAssign } = orderData;
    Object.assign(order, toAssign);
    return this.ordersRepository.save(order, { listeners: !ignoreSubscribers });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.getOrder(id);
    await this.ordersRepository.delete({ id });
  }

  async createOrderWithVNPay(
    userId: number,
    orderData: OrderCreateDto,
  ): Promise<string> {
    const order = await this.createOrder(userId, orderData);
    if (!order) {
      throw new NotFoundException('Order creation failed');
    }
    return this.createVNPayUrl(order);
  }

  private createVNPayUrl(order: Order): string {
    const tmnCode = this.configService.get<string>('VNP_TMN_CODE');
    const secretKey = this.configService.get<string>('VNP_HASH_SECRET');
    const vnpUrl = this.configService.get<string>('VNP_URL');
    const returnUrl = this.configService.get<string>('VNP_RETURN_URL');

    const createDate = formatDate(new Date());
    const amount = (
      order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) *
      100
    ).toString();

    const params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order.id.toString(),
      vnp_OrderInfo: `Thanh toan cho don hang ${order.id}`,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sortedParams = sortObject(params);
    const querystring = Object.entries(sortedParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join('&');

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(querystring, 'utf-8')).digest('hex');

    return `${vnpUrl}?${querystring}&vnp_SecureHash=${signed}`;
  }

  async updateOrderPaymentStatus(
    orderId: number,
    isSuccess: boolean,
    amount?: number,
  ): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.paymentStatus = isSuccess ? 'PAID' : 'FAILED';
    if (isSuccess) {
      order.paidAmount = amount;
    }

    await this.ordersRepository.save(order);
  }
}
