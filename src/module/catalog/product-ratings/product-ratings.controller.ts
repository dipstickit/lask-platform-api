import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductRatingsService } from './product-ratings.service';
import { ProductRatingDto } from './dto/product-rating.dto';
import { ProductRating } from './models/product-rating.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/models/role.enum';
import { ReqUser } from '../../auth/decorators/user.decorator';
import { User } from '../../users/models/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Features } from '../../settings/guards/features.decorator';
import { Public } from 'src/module/auth/decorators/public.decorator';

@ApiTags('Product ratings')
@Features('Product ratings')
@Controller('products/:productId/ratings')
export class ProductRatingsController {
  constructor(private readonly productRatingsService: ProductRatingsService) {}

  @Public()
  @Get('')
  async getProductRatings(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductRating[]> {
    return await this.productRatingsService.getProductRatings(productId);
  }

  @Post('')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async createProductRating(
    @ReqUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: ProductRatingDto,
  ): Promise<ProductRating> {
    return await this.productRatingsService.createProductRating(
      user,
      productId,
      body,
    );
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async updateProductRating(
    @ReqUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ProductRatingDto,
  ): Promise<ProductRating> {
    const checkUser = await this.productRatingsService.checkProductRatingUser(
      id,
      user.id,
    );
    if (!checkUser && user.role === Role.Customer) {
      throw new ForbiddenException(['forbidden']);
    }
    return await this.productRatingsService.updateProductRating(
      productId,
      id,
      body,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async deleteProductRating(
    @ReqUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const checkUser = await this.productRatingsService.checkProductRatingUser(
      id,
      user.id,
    );
    if (!checkUser && user.role === Role.Customer) {
      throw new ForbiddenException(['forbidden']);
    }
    await this.productRatingsService.deleteProductRating(productId, id);
  }
}
