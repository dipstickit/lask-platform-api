import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryGroup } from '../entities/category-group.entity';
import { CategoryFilterDto } from './dto/filter-category.dto';
import { CreateCategoryGroupDto } from '../dto/create-category-group.dto';
import {
  DUPLICATED_CATEGORY_NAME,
  DUPLICATED_CATEGORY_SLUG,
  FAIL_LOAD_CATEGORY_GROUP,
  NOTFOUND_CATEGORY,
} from 'src/utils/message';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryGroup)
    private categoryGroupRepository: Repository<CategoryGroup>,
  ) {}

  async findOneCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['groups', 'products'],
    });
    if (!category) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, slug } = createCategoryDto;

    const [existingName, existingSlug] = await Promise.all([
      this.categoryRepository.findOne({ where: { name } }),
      this.categoryRepository.findOne({ where: { slug } }),
    ]);

    if (existingName) {
      throw new BadRequestException(DUPLICATED_CATEGORY_NAME);
    }
    if (existingSlug) {
      throw new BadRequestException(DUPLICATED_CATEGORY_SLUG);
    }
    const category = this.categoryRepository.create(createCategoryDto);
    Object.assign(category, createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, slug, groups, ...rest } = updateCategoryDto;

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['groups'],
    });
    if (!category) {
      throw new BadRequestException(NOTFOUND_CATEGORY);
    }

    const [existingName, existingSlug] = await Promise.all([
      name && name !== category.name
        ? this.categoryRepository.findOne({ where: { name } })
        : null,
      slug && slug !== category.slug
        ? this.categoryRepository.findOne({ where: { slug } })
        : null,
    ]);

    if (existingName) throw new BadRequestException(DUPLICATED_CATEGORY_NAME);
    if (existingSlug) throw new BadRequestException(DUPLICATED_CATEGORY_SLUG);

    Object.assign(category, rest);
    if (name) category.name = name;
    if (slug) category.slug = slug;

    if (groups && groups.length > 0) {
      const updatedGroups = await Promise.all(
        groups.map(async (groupData) => {
          let group = await this.categoryGroupRepository.findOne({
            where: { name: groupData.name },
          });
          if (!group) {
            group = this.categoryGroupRepository.create(groupData);
            group = await this.categoryGroupRepository.save(group);
          }
          return group;
        }),
      );
      category.groups = updatedGroups[0];
    }
    return this.categoryRepository.update(id, category);
  }

  async remove(id: number): Promise<void> {
    const existCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existCategory) {
      throw new BadRequestException(NOTFOUND_CATEGORY);
    }
    await this.categoryRepository.delete({ id });
  }

  async findAllcategory(queryObj: CategoryFilterDto = {}) {
    const {
      name,
      description,
      slug,
      sortBy,
      sortDescending,
      pageSize,
      current,
    } = queryObj;

    const defaultLimit = pageSize || 10;
    const defaultPage = current || 1;
    const offset = (defaultPage - 1) * defaultLimit;

    const query = this.categoryRepository.createQueryBuilder('category');

    if (name) {
      query.andWhere('category.name ILike :name', { name: `%${name}%` });
    }
    if (description) {
      query.andWhere('category.description ILike :description', {
        description: `%${description}%`,
      });
    }
    if (slug) {
      query.andWhere('category.slug ILike :slug', { slug: `%${slug}%` });
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
}
