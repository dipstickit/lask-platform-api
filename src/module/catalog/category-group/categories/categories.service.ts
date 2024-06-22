import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryFilterDto } from './dto/filter-category.dto';
import {
  DUPLICATED_CATEGORY_NAME,
  DUPLICATED_CATEGORY_SLUG,
  NOTFOUND_CATEGORY,
} from 'src/utils/message';
import { CategoryGroupService } from '../category-group.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly categoryGroupService: CategoryGroupService,
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

  async createCategory(
    createCategoryDto: CreateCategoryDto | CreateCategoryDto[],
  ) {
    const isBulkOperation = Array.isArray(createCategoryDto);
    const dtos = isBulkOperation ? createCategoryDto : [createCategoryDto];

    const categoriesToCreate = [];

    for (const dto of dtos) {
      const { name, slug, categoryGroupId } = dto;

      const existingName = await this.categoryRepository.findOneBy({ name });
      const existingSlug = await this.categoryRepository.findOneBy({ slug });

      if (existingName) {
        throw new BadRequestException(DUPLICATED_CATEGORY_NAME);
      }
      if (existingSlug) {
        throw new BadRequestException(DUPLICATED_CATEGORY_SLUG);
      }

      const categoryGroup =
        await this.categoryGroupService.findOneById(categoryGroupId);
      if (!categoryGroup) {
        throw new BadRequestException(
          `Category group with ID ${categoryGroupId} not found`,
        );
      }

      const category = this.categoryRepository.create({
        ...dto,
        categoryGroup,
      });

      categoriesToCreate.push(category);
    }

    const result = isBulkOperation
      ? await this.categoryRepository.save(categoriesToCreate)
      : await this.categoryRepository.save(categoriesToCreate[0]);

    return result;
  }

  // async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   const { name, slug, groups, ...rest } = updateCategoryDto;

  //   const category = await this.categoryRepository.findOne({
  //     where: { id },
  //     relations: ['groups'],
  //   });
  //   if (!category) {
  //     throw new BadRequestException(NOTFOUND_CATEGORY);
  //   }

  //   const [existingName, existingSlug] = await Promise.all([
  //     name && name !== category.name
  //       ? this.categoryRepository.findOne({ where: { name } })
  //       : null,
  //     slug && slug !== category.slug
  //       ? this.categoryRepository.findOne({ where: { slug } })
  //       : null,
  //   ]);

  //   if (existingName) throw new BadRequestException(DUPLICATED_CATEGORY_NAME);
  //   if (existingSlug) throw new BadRequestException(DUPLICATED_CATEGORY_SLUG);

  //   const updateData: Partial<Category> = { ...rest };
  //   if (name) category.name = name;
  //   if (slug) category.slug = slug;

  //   if (groups && groups.length > 0) {
  //     const updatedGroups = await Promise.all(
  //       groups.map(async (groupData) => {
  //         let group = await this.categoryGroupRepository.findOne({
  //           where: { name: groupData.name },
  //         });
  //         if (!group) {
  //           group = this.categoryGroupRepository.create(groupData);
  //           group = await this.categoryGroupRepository.save(group);
  //         }
  //         return group;
  //       }),
  //     );
  //     updateData.groups = updatedGroups[groups.length - 1];
  //   }
  //   return await this.categoryRepository.save(category);
  // }

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
