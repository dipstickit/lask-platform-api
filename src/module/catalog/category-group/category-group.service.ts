import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryGroupDto } from './dto/create-category-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from './entities/category-group.entity';
import { Repository } from 'typeorm';
import {
  DUPLICATED_CATEGORY_NAME,
  DUPLICATED_CATEGORY_SLUG,
  FAIL_LOAD_CATEGORY_GROUP,
  NOTFOUND_CATEGORY,
} from 'src/utils/message';

@Injectable()
export class CategoryGroupService {
  constructor(
    @InjectRepository(CategoryGroup)
    private categoryGroupRepository: Repository<CategoryGroup>,
  ) {}

  async createCategoryGroup(createCategoryGroupDto: CreateCategoryGroupDto) {
    const { name, slug } = createCategoryGroupDto;
    const existingGroupByName = await this.categoryGroupRepository.findOne({
      where: { name },
    });
    if (existingGroupByName) {
      throw new BadRequestException(DUPLICATED_CATEGORY_NAME);
    }
    const existingGroupBySlug = await this.categoryGroupRepository.findOne({
      where: { slug },
    });
    if (existingGroupBySlug) {
      throw new BadRequestException(DUPLICATED_CATEGORY_SLUG);
    }
    const categoryGroup = this.categoryGroupRepository.create(
      createCategoryGroupDto,
    );
    return this.categoryGroupRepository.save(categoryGroup);
  }

  async findAllCategoryGroups() {
    try {
      return this.categoryGroupRepository.find({
        order: { id: 'ASC' },
        relations: ['categories'],
      });
    } catch (error) {
      throw new BadRequestException(FAIL_LOAD_CATEGORY_GROUP);
    }
  }

  async findOneCategoryGroupById(id: number) {
    const categoryGroup = await this.categoryGroupRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!categoryGroup) throw new BadRequestException(NOTFOUND_CATEGORY);
    return categoryGroup;
  }
}
