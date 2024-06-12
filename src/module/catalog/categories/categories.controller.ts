import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { CategoryGroup } from './entities/category-group.entity';
import { CreateCategoryGroupDto } from './dto/create-category-group.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAllcategory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOneCategoryById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategoryById(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @Get('/groups')
  @ApiOkResponse({
    type: [CategoryGroup],
    description: 'List of all category groups',
  })
  async findAllCategoryGroups(): Promise<CategoryGroup[]> {
    return await this.categoriesService.findAllCategoryGroups();
  }

  @Post('/groups')
  createCategoryGroup(@Body() createCategoryGroupDto: CreateCategoryGroupDto) {
    return this.categoriesService.createCategoryGroup(createCategoryGroupDto);
  }

  @Get('groups/:id')
  findOneCategoryGroupById(@Param('id') id: string) {
    return this.categoriesService.findOneCategoryGroupById(+id);
  }

}
