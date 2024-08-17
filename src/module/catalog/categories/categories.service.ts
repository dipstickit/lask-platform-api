import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './models/category.entity';
import { Product } from '../products/models/product.entity';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { NotFoundError } from '../../errors/not-found.error';
import { NotRelatedError } from '../../errors/not-related.error';
import { CategoryGroup } from './models/category-group.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryGroup)
    private readonly categoryGroupsRepository: Repository<CategoryGroup>,
    private readonly productsService: ProductsService,
  ) {}

  async getCategories(withProducts = false): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['parentCategory', ...(withProducts ? ['products'] : [])],
    });
  }

  async getCategory(
    id: number,
    children = true,
    products = false,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: [
        'parentCategory',
        ...(children ? ['childCategories'] : []),
        ...(products
          ? ['products', 'products.attributes', 'products.attributes.type']
          : []),
      ],
    });

    if (!category) {
      throw new NotFoundError('category', 'id', id.toString());
    }

    return category;
  }

  async getCategoryGroups(): Promise<CategoryGroup[]> {
    return this.categoryGroupsRepository.find({ relations: ['categories'] });
  }

  async createCategory(categoryData: CategoryCreateDto): Promise<Category> {
    const category = this.categoriesRepository.create(categoryData);

    if (categoryData.parentCategoryId) {
      await this.updateParentCategory(category, categoryData.parentCategoryId);
    }

    return this.categoriesRepository.save(category);
  }

  async updateCategory(
    id: number,
    categoryData: CategoryUpdateDto,
  ): Promise<Category> {
    const category = await this.getCategory(id, false);

    Object.assign(category, categoryData);

    if (categoryData.parentCategoryId) {
      await this.updateParentCategory(category, categoryData.parentCategoryId);
    }

    if (categoryData.groups) {
      category.groups = await this.getOrCreateCategoryGroups(
        categoryData.groups,
      );
    }

    return this.categoriesRepository.save(category);
  }

  private async updateParentCategory(
    category: Category,
    parentCategoryId: number,
  ): Promise<void> {
    category.parentCategory = await this.getCategory(parentCategoryId, false);
  }

  private async getOrCreateCategoryGroups(
    groupDataList: { name: string }[],
  ): Promise<CategoryGroup[]> {
    const groups = [];
    for (const groupData of groupDataList) {
      let group = await this.categoryGroupsRepository.findOne({
        where: { name: groupData.name },
      });
      if (!group) {
        group = this.categoryGroupsRepository.create({ name: groupData.name });
        group = await this.categoryGroupsRepository.save(group);
      }
      groups.push(group);
    }
    return groups;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.getCategory(id, false);
    await this.categoriesRepository.delete(id);
  }

  async getCategoryProducts(
    id: number,
    withHidden = false,
  ): Promise<Product[]> {
    const category = await this.getCategory(id, false, true);
    return category.products.filter((product) => withHidden || product.visible);
  }

  async addCategoryProduct(id: number, productId: number): Promise<Product> {
    const product = await this.productsService.getProduct(productId, true);
    const category = await this.getCategory(id, false, true);

    if (!category.products.some((p) => p.id === productId)) {
      category.products.push(product);
      await this.categoriesRepository.save(category);
    }

    return product;
  }

  async deleteCategoryProduct(id: number, productId: number): Promise<void> {
    const product = await this.productsService.getProduct(productId, true);
    const category = await this.getCategory(id, false, true);

    if (!category.products.some((p) => p.id === productId)) {
      throw new NotRelatedError('category', 'product');
    }

    category.products = category.products.filter((p) => p.id !== productId);
    await this.categoriesRepository.save(category);
  }
}
