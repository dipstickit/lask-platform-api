import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './models/cart.entity';
import { ProductsService } from '../catalog/products/products.service';
import { User } from '../users/models/user.entity';
import { CartDto } from './dto/cart.dto';
import { CartItem } from './models/cart-item.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartsRepository: Repository<Cart>,
    private productsService: ProductsService,
  ) {}

  async getCart(user: User | null, sessionId?: string): Promise<Cart> {
    const cart = user?.id
      ? await this.cartsRepository.findOne({ where: { user: { id: user.id } } })
      : sessionId
        ? await this.cartsRepository.findOne({ where: { sessionId } })
        : null;

    return cart || this.createCart(user, sessionId);
  }

  private async createCart(
    user: User | null,
    sessionId?: string,
  ): Promise<Cart> {
    const cart = new Cart();
    if (user) {
      cart.user = user;
    } else {
      cart.sessionId = sessionId;
    }
    cart.items = [];
    return this.cartsRepository.save(cart);
  }

  async updateCart(
    updateData: CartDto,
    user: User | null,
    sessionId?: string,
  ): Promise<Cart> {
    const cart = await this.getCart(user, sessionId);
    cart.items = await Promise.all(
      updateData.items.map(async ({ productId, quantity }) => {
        const product = await this.productsService.getProduct(productId);
        const item = new CartItem();
        item.product = product;
        item.quantity = quantity;
        return item;
      }),
    );
    return this.cartsRepository.save(cart);
  }
}
