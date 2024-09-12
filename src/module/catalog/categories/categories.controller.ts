import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/models/role.enum';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { Product } from '../products/models/product.entity';
import { Category } from './models/category.entity';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryGroup } from './models/category-group.entity';
import { User } from '../../users/models/user.entity';
import { ReqUser } from '../../auth/decorators/user.decorator';
import { Public } from 'src/module/auth/decorators/public.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Public()
  @Get('/groups')
  async getCategoryGroups(): Promise<CategoryGroup[]> {
    return await this.categoriesService.getCategoryGroups();
  }

  @Public()
  @Get('/:id')
  async getCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return await this.categoriesService.getCategory(id);
  }

  @Post()
  @Roles(Role.Admin, Role.Manager)
  async createCategory(@Body() category: CategoryCreateDto): Promise<Category> {
    return await this.categoriesService.createCategory(category);
  }

  @Patch('/:id')
  @Roles(Role.Admin, Role.Manager)
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: CategoryUpdateDto,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(id, category);
  }

  @Delete('/:id')
  @Roles(Role.Admin, Role.Manager)
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }

  @Public()
  @Get('/:id/products')
  async getCategoryProducts(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user?: User,
  ): Promise<Product[]> {
    if (user && [Role.Admin, Role.Manager, Role.Sales].includes(user?.role)) {
      return await this.categoriesService.getCategoryProducts(id, true);
    }
    return await this.categoriesService.getCategoryProducts(id);
  }

  @Post('/:id/products')
  @Roles(Role.Admin, Role.Manager)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
      },
      required: ['productId'],
    },
  })
  async addCategoryProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body('productId') productId: number,
  ): Promise<Product> {
    return await this.categoriesService.addCategoryProduct(id, productId);
  }

  @Delete('/:id/products/:productId')
  @Roles(Role.Admin, Role.Manager)
  async deleteCategoryProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    await this.categoriesService.deleteCategoryProduct(id, productId);
  }
}
