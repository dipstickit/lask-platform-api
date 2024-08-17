import { Injectable } from '@nestjs/common';
import { Importer } from '../../import-export/models/importer.interface';
import { Collection } from '../../import-export/models/collection.type';
import { ParseError } from '../../errors/parse.error';
import { IdMap } from '../../import-export/models/id-map.type';
import { ProductsService } from './products.service';
import { Product } from './models/product.entity';
import { Attribute } from './models/attribute.entity';
import { AttributeType } from '../attribute-types/models/attribute-type.entity';

@Injectable()
export class ProductsImporter implements Importer {
  constructor(private readonly productsService: ProductsService) {}

  async import(
    products: Collection,
    idMaps: Record<string, IdMap>,
  ): Promise<IdMap> {
    const parsedProducts = this.parseProducts(products, idMaps.attributeTypes);
    const idMap: IdMap = {};

    for (const product of parsedProducts) {
      const { id, ...createDto } = product;
      const { id: newId } = await this.productsService.createProduct(createDto);
      idMap[id] = newId;
    }

    return idMap;
  }

  async clear(): Promise<number> {
    const products = await this.productsService.getProducts(true);
    const deletePromises = products.map((product) =>
      this.productsService.deleteProduct(product.id),
    );
    await Promise.all(deletePromises);
    return products.length;
  }

  private parseProducts(
    products: Collection,
    attributeTypesIdMap: IdMap,
  ): Product[] {
    return products.map((product) =>
      this.parseProduct(product, attributeTypesIdMap),
    );
  }

  private parseProduct(
    product: Collection[number],
    attributeTypesIdMap: IdMap,
  ): Product {
    try {
      const parsedProduct = new Product();
      parsedProduct.id = product.id as number;
      parsedProduct.name = product.name as string;
      parsedProduct.description = product.description as string;
      parsedProduct.price = product.price as number;
      parsedProduct.stock = product.stock as number;
      parsedProduct.visible = product.visible as boolean;

      if (typeof product.attributes === 'string') {
        product.attributes = JSON.parse(product.attributes);
      }

      parsedProduct.attributes = (product.attributes as Collection).map(
        (attribute) => this.parseAttribute(attribute, attributeTypesIdMap),
      );

      return parsedProduct;
    } catch (error) {
      throw new ParseError('product');
    }
  }

  private parseAttribute(
    attribute: Collection[number],
    attributeTypesIdMap: IdMap,
  ): Attribute {
    try {
      const parsedAttribute = new Attribute();
      parsedAttribute.value = attribute.value as string;
      parsedAttribute.type = {
        id: attributeTypesIdMap[attribute.typeId as number],
      } as AttributeType;
      return parsedAttribute;
    } catch (error) {
      throw new ParseError('attribute');
    }
  }
}
