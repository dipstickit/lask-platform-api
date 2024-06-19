import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import { CreateCategoryGroupDto } from './dto/create-category-group.dto';
import { ResponseMessage } from 'src/decorator/customize';
import {
  CREATE_CATEGORY_GROUP_SUCCESS,
  GET_CATEGORY_GROUP_DETAIL_SUCCESS,
  GET_CATEGORY_GROUP_SUCCESS,
} from 'src/utils/message';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category-group')
@Controller('category-group')
export class CategoryGroupController {
  constructor(private readonly categoryGroupService: CategoryGroupService) {}

  @Get()
  @ResponseMessage(GET_CATEGORY_GROUP_SUCCESS)
  findAllCategoryGroups() {
    return this.categoryGroupService.findAllCategoryGroups();
  }

  @Post()
  @ResponseMessage(CREATE_CATEGORY_GROUP_SUCCESS)
  createCategoryGroup(@Body() createCategoryGroupDto: CreateCategoryGroupDto) {
    return this.categoryGroupService.createCategoryGroup(
      createCategoryGroupDto,
    );
  }

  @Get(':id')
  @ResponseMessage(GET_CATEGORY_GROUP_DETAIL_SUCCESS)
  findOneCategoryGroupById(@Param('id') id: string) {
    return this.categoryGroupService.findOneCategoryGroupById(+id);
  }
}
