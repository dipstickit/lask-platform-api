import { Injectable } from '@nestjs/common';
import { Importer } from '../../import-export/models/importer.interface';
import { Collection } from '../../import-export/models/collection.type';
import { ParseError } from '../../errors/parse.error';
import { IdMap } from '../../import-export/models/id-map.type';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.entity';
import { CategoryGroup } from './models/category-group.entity';
import { Product } from '../products/models/product.entity';

@Injectable()
export class CategoriesImporter implements Importer {
  constructor(private readonly categoriesService: CategoriesService) {}

  async import(
    categories: Collection,
    idMaps: Record<string, IdMap>,
  ): Promise<IdMap> {
    const parsedCategories = this.parseCategories(categories, idMaps.products);
    const idMap: IdMap = {};

    for (const category of parsedCategories) {
      const { id, parentCategory, products, ...createDto } = category;
      const { id: newId } =
        await this.categoriesService.createCategory(createDto);
      idMap[id] = newId;
    }

    for (const category of parsedCategories) {
      await this.categoriesService.updateCategory(idMap[category.id], {
        groups: category.groups,
        parentCategoryId: category.parentCategory?.id
          ? idMap[category.parentCategory.id]
          : undefined,
      });

      for (const product of category.products) {
        await this.categoriesService.addCategoryProduct(
          idMap[category.id],
          product.id,
        );
      }
    }

    return idMap;
  }

  async clear(): Promise<number> {
    const categories = await this.categoriesService.getCategories();
    let deleted = 0;

    for (const category of categories) {
      await this.categoriesService.deleteCategory(category.id);
      deleted += 1;
    }

    return deleted;
  }

  private parseCategories(
    categories: Collection,
    productsIdMap: IdMap,
  ): Category[] {
    return categories.map((category) =>
      this.parseCategory(category, productsIdMap),
    );
  }

  private parseCategory(
    category: Collection[number],
    productsIdMap: IdMap,
  ): Category {
    const parsedCategory = new Category();

    try {
      parsedCategory.id = Number(category.id);
      parsedCategory.name = String(category.name);
      parsedCategory.description = String(category.description);
      parsedCategory.slug = String(category.slug);

      if (category.parentCategoryId) {
        parsedCategory.parentCategory = {
          id: Number(category.parentCategoryId),
        } as Category;
      }

      parsedCategory.groups = this.parseGroups(category.groups);
      parsedCategory.products = this.parseProducts(
        category.products,
        productsIdMap,
      );
    } catch {
      throw new ParseError('category');
    }

    return parsedCategory;
  }

  private parseGroups(groups: unknown): CategoryGroup[] {
    if (typeof groups === 'string') {
      try {
        groups = JSON.parse(groups);
      } catch {
        throw new ParseError('category group');
      }
    }

    return (groups as Collection).map((group) => {
      const parsedGroup = new CategoryGroup();
      parsedGroup.name = String(group.name);
      return parsedGroup;
    });
  }

  private parseProducts(products: unknown, productsIdMap: IdMap): Product[] {
    if (typeof products === 'string') {
      try {
        products = JSON.parse(products);
      } catch {
        throw new ParseError('category product');
      }
    }

    return (products as Collection).map((product) => {
      const id = productsIdMap[Number(product.id)] as number;
      if (id === undefined) {
        throw new ParseError('category product');
      }
      return { id } as Product;
    });
  }
}
