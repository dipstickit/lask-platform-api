import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './models/product.entity';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { Attribute } from './models/attribute.entity';
import { AttributeDto } from './dto/attribute.dto';
import { NotFoundError } from '../../errors/not-found.error';
import { OrderItem } from '../../sales/orders/models/order-item.entity';
import { AttributeTypesService } from '../attribute-types/attribute-types.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Attribute)
    private readonly attributesRepository: Repository<Attribute>,
    private readonly attributeTypesService: AttributeTypesService,
  ) {}

  async getProducts(withHidden = false): Promise<Product[]> {
    return this.productsRepository.find({
      where: { visible: !withHidden },
    });
  }

  async getProduct(id: number, withHidden = false): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, visible: !withHidden },
    });
    if (!product) {
      throw new NotFoundError('product', 'id', id.toString());
    }
    return product;
  }

  async createProduct(productData: ProductCreateDto): Promise<Product> {
    const product = this.productsRepository.create({
      ...productData,
      photosOrder: '',
    });
    return this.productsRepository.save(product);
  }

  async updateProduct(
    id: number,
    productData: ProductUpdateDto,
  ): Promise<Product> {
    const product = await this.getProduct(id, true);
    if (productData.photosOrder) {
      await this.checkProductPhotosOrder(product, productData.photosOrder);
    }
    Object.assign(product, productData);
    return this.productsRepository.save(product);
  }

  private async checkProductPhotosOrder(product: Product, newOrder: string) {
    const sortedPhotos = product.photos.map((p) => p.id).sort((a, b) => a - b);
    const sortedNewOrder = newOrder
      .split(',')
      .map((p) => parseInt(p, 10))
      .sort((a, b) => a - b);
    if (sortedPhotos.join(',') !== sortedNewOrder.join(',')) {
      throw new NotFoundError('product photo');
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    await this.getProduct(id, true);
    await this.productsRepository.delete({ id });
    return true;
  }

  async checkProductsStocks(items: OrderItem[]): Promise<boolean> {
    const productIds = items.map((i) => i.product.id);
    const products = await this.productsRepository.find({
      where: { id: In(productIds) },
    });

    return products.every((p) => {
      const item = items.find((i) => i.product.id === p.id);
      return !item || p.stock >= item.quantity;
    });
  }

  async updateProductsStocks(
    type: 'add' | 'subtract',
    items: OrderItem[],
  ): Promise<void> {
    const productIds = items.map((i) => i.product.id);
    const products = await this.productsRepository.find({
      where: { id: In(productIds) },
    });

    await Promise.all(
      products.map(async (p) => {
        const item = items.find((i) => i.product.id === p.id);
        if (!item) return;

        p.stock =
          type === 'add' ? p.stock + item.quantity : p.stock - item.quantity;
        await this.productsRepository.save(p);
      }),
    );
  }

  async updateProductAttributes(
    id: number,
    attributes: AttributeDto[],
  ): Promise<Product> {
    const product = await this.getProduct(id, true);
    const attributesToSave = await Promise.all(
      attributes.map(async (attribute) => {
        const attributeType = await this.attributeTypesService.getAttributeType(
          attribute.typeId,
        );
        await this.attributeTypesService.checkAttributeType(
          attributeType.valueType,
          attribute.value,
        );

        return this.attributesRepository.create({
          type: attributeType,
          value: attribute.value,
        });
      }),
    );

    product.attributes = await this.attributesRepository.save(attributesToSave);
    return this.productsRepository.save(product);
  }
}
