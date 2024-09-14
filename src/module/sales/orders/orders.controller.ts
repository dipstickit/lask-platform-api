import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from '../../users/models/role.enum';
import { OrdersService } from './orders.service';
import { OrderCreateDto } from './dto/order-create.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ReqUser } from '../../auth/decorators/user.decorator';
import { User } from '../../users/models/user.entity';
import { OrderUpdateDto } from './dto/order-update.dto';
import { ApiTags } from '@nestjs/swagger';
import { Order } from './models/order.entity';
import { Public } from 'src/module/auth/decorators/public.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  async createOrder(
    @ReqUser() user: User | null,
    @Body() body: OrderCreateDto,
  ): Promise<Order> {
    return await this.ordersService.createOrder(user?.id ?? null, body);
  }

  @Get()
  @Roles(Role.Admin, Role.Manager, Role.Sales)
  async getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Get('/my')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async getUserOrders(@ReqUser() user: User): Promise<Order[]> {
    return await this.ordersService.getUserOrders(user.id);
  }

  @Get('/:id')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async getOrder(
    @ReqUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    const checkUser = await this.ordersService.checkOrderUser(user.id, id);
    if (!checkUser && user.role === Role.Customer) {
      throw new ForbiddenException();
    }
    return await this.ordersService.getOrder(id);
  }

  @Patch('/:id')
  @Roles(Role.Admin, Role.Manager, Role.Sales)
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: OrderUpdateDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrder(id, body);
  }

  @Public()
  @Post('/create-vnpay')
  async createOrderWithVNPay(
    @ReqUser() user: User,
    @Body() orderCreateDto: OrderCreateDto,
  ) {
    const vnpUrl = await this.ordersService.createOrderWithVNPay(
      user.id,
      orderCreateDto,
    );
    return { vnpUrl };
  }
}
