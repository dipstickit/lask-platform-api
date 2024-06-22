import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryGroupDto } from '../dto/create-category-group.dto';
import { ResponseMessage } from 'src/decorator/customize';
import {
  CREATE_CATEGORY_GROUP_SUCCESS,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  GET_CATEGORY_DETAIL_SUCCESS,
  GET_CATEGORY_GROUP_DETAIL_SUCCESS,
  GET_CATEGORY_GROUP_SUCCESS,
  GET_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_SUCCESS,
} from 'src/utils/message';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage(CREATE_CATEGORY_SUCCESS)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  @ResponseMessage(GET_CATEGORY_SUCCESS)
  findAll() {
    return this.categoriesService.findAllcategory();
  }

  @Get(':id')
  @ResponseMessage(GET_CATEGORY_DETAIL_SUCCESS)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOneCategoryById(+id);
  }

  // @Put(':id')
  // @ResponseMessage(UPDATE_CATEGORY_SUCCESS)
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.updateCategoryById(+id, updateCategoryDto);
  // }

  @Delete(':id')
  @ResponseMessage(DELETE_CATEGORY_SUCCESS)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
