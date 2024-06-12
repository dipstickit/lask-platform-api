import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryGroup } from './entities/category-group.entity';
import { CategoryFilterDto } from './dto/filter-category.dto';
import { CreateCategoryGroupDto } from './dto/create-category-group.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryGroup)
    private categoryGroupRepository: Repository<CategoryGroup>,
  ) { }

  async findOneCategoryById(
    id: number,
    children = true,
    products = false,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: [
        // Always include a relationship to the parent category
        'parentCategory',
        // Include child categories if 'children' is true
        ...(children ? ['childCategories'] : []),
        // Include products and product attributes if 'products' is true
        ...(products
          ? ['products', 'products.attributes', 'products.attributes.type']
          : []),
      ],
    });
    if (!category) {
      throw new BadRequestException('Category with id ${id} not found');
    }
    return category;
  }

  private async updateParentCategory(
    category: Category,
    parentCategoryId: number,
  ): Promise<boolean> {
    // Check if the parentCategoryId is different from the current one to avoid unnecessary database call
    if (category.parentCategory?.id !== parentCategoryId) {
      const parentCategory = await this.findOneCategoryById(
        parentCategoryId,
        false,
      );

      // Ensure the parent category was fetched successfully
      if (!parentCategory) {
        throw new Error(
          `Parent category with ID ${parentCategoryId} not found`,
        );
      }

      category.parentCategory = parentCategory;
    }
    return true;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingName = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (existingName) throw new BadRequestException('Name already exists');
    const existingSlug = await this.categoryRepository.findOneBy({
      slug: createCategoryDto.slug,
    });
    if (existingSlug) throw new BadRequestException('Slug already exists');
    const category = new Category();
    Object.assign(category, createCategoryDto);
    // Update the parent category if there is a parent Category Id
    if (createCategoryDto.parentCategoryId) {
      await this.updateParentCategory(
        category,
        createCategoryDto.parentCategoryId,
      );
    }
    return this.categoryRepository.save(category);
  }

  async updateCategoryById(
    id: number,
    categoryData: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneCategoryById(id, false);
    // Destructure categoryData for easier access
    const { parentCategoryId, groups, ...rest } = categoryData;
    Object.assign(category, rest);
    if (parentCategoryId) {
      await this.updateParentCategory(category, parentCategoryId);
    }
    if (groups) {
      // Use Promise.all to handle multiple async operations in parallel
      const updatedGroups = await Promise.all(
        groups.map(async (groupData) => {
          let group = await this.categoryGroupRepository.findOne({
            where: { name: groupData.name },
          });
          if (!group) {
            group = new CategoryGroup();
            group.name = groupData.name;
            group = await this.categoryGroupRepository.save(group);
          }
          return group;
        }),
      );
      category.groups = updatedGroups;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const existCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existCategory) {
      throw new BadRequestException('Category not found');
    }
    await this.categoryRepository.delete({ id });
  }

  async findAllcategory(queryObj: CategoryFilterDto = {}) {
    const {
      name,
      description,
      slug,
      parentCategoryId,
      sortBy,
      sortDescending,
      pageSize,
      current,
    } = queryObj;

    const defaultLimit = pageSize ? pageSize : 10;
    const defaultPage = current ? current : 1;
    const offset = (defaultPage - 1) * defaultLimit;

    const query = this.categoryRepository.createQueryBuilder('category');

    // Apply filters
    if (name) {
      query.andWhere('category.name ILike :name', {
        name: `%${name}%`,
      });
    }
    if (description) {
      query.andWhere('category.description ILike :description', {
        description: `%${description}%`,
      });
    }
    if (slug) {
      query.andWhere('category.slug ILike :slug', { slug: `%${slug}%` });
    }
    if (parentCategoryId) {
      query.andWhere('category.parentCategoryId = :parentCategoryId', {
        parentCategoryId,
      });
    }
    const sortableCriterias = ['name', 'description', 'slug'];
    if (sortableCriterias.includes(sortBy)) {
      query.orderBy(`category.${sortBy}`, sortDescending ? 'DESC' : 'ASC');
    }

    const [result, totalItems] = await query
      .skip(offset)
      .take(defaultLimit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      currentPage: defaultPage,
      totalPages,
      pageSize: defaultLimit,
      totalItems,
      items: result,
    };
  }

  async createCategoryGroup(createCategoryGroupDto: CreateCategoryGroupDto) {
    const existingName = await this.categoryRepository.findOneBy({
      name: createCategoryGroupDto.name,
    });
    if (existingName) throw new BadRequestException('Name already exists');
    const categoryGroup = this.categoryGroupRepository.create(
      createCategoryGroupDto,
    );
    return this.categoryGroupRepository.save(categoryGroup);
  }

  async findAllCategoryGroups() {
    try {
      return this.categoryGroupRepository.find({
        order: {
          id: 'ASC',
        },
        relations: ['categories'],
      });
    } catch (error) {
      throw new BadRequestException('Failed to load category groups');
    }
  }

  async findOneCategoryGroupById(id: number) {
    const existcategoryGroup = await this.categoryGroupRepository.findOne({
      where: { id },
    });
    if (!existcategoryGroup)
      throw new BadRequestException('Category group not found');

    return existcategoryGroup;
  }
}
