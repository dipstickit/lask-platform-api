import { Injectable } from '@nestjs/common';
import { Exporter } from '../../import-export/models/exporter.interface';
import { Product } from './models/product.entity';
import { ProductsService } from './products.service';
import { Attribute } from './models/attribute.entity';
import { AttributeType } from '../attribute-types/models/attribute-type.entity';

@Injectable()
export class ProductsExporter implements Exporter<Product> {
  constructor(private readonly productsService: ProductsService) {}

  async export(): Promise<Product[]> {
    const products = await this.productsService.getProducts(true);
    return products.map(this.prepareProduct.bind(this));
  }

  // private prepareProduct(product: Product) {
  //   const preparedProduct = new Product();
  //   preparedProduct.id = product.id;
  //   preparedProduct.name = product.name;
  //   preparedProduct.description = product.description;
  //   preparedProduct.price = product.price;
  //   preparedProduct.stock = product.stock;
  //   preparedProduct.visible = product.visible;

  //   preparedProduct.attributes = product.attributes.map((a) =>
  //     this.prepareAttribute(a),
  //   ) as Attribute[];

  //   return preparedProduct;
  // }
  private prepareProduct(product: Product): Product {
    const preparedProduct = { ...product };
    preparedProduct.attributes = product.attributes.map(this.prepareAttribute);
    return preparedProduct;
  }

  private prepareAttribute(attribute: Attribute): Attribute {
    const preparedAttribute = new Attribute();
    preparedAttribute.value = attribute.value;
    preparedAttribute.type = attribute.type;
    return preparedAttribute;
  }
}
