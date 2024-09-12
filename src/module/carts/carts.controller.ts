import { Body, Controller, Get, Put, Session } from '@nestjs/common';
import { CartsService } from './carts.service';
import { User } from '../users/models/user.entity';
import { ReqUser } from '../auth/decorators/user.decorator';
import { CartDto } from './dto/cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { Cart } from './models/cart.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Public()
  @Get('my')
  async getCart(
    @ReqUser() user: User | null,
    @Session() session: Record<string, any>,
  ): Promise<Cart> {
    session.cart = true;
    return this.cartsService.getCart(user, session.id);
  }

  @Public()
  @Put('my')
  async updateCart(
    @ReqUser() user: User | null,
    @Session() session: Record<string, any>,
    @Body() body: CartDto,
  ): Promise<Cart> {
    session.cart = true;
    return this.cartsService.updateCart(body, user, session.id);
  }
}
