import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseBoolPipe,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductRatingPhotosService } from './product-rating-photos.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../users/models/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../users/models/user.entity';
import { ProductRating } from '../models/product-rating.entity';
import { Features } from '../../../settings/guards/features.decorator';
import { fileResponseSchema } from '../../../local-files/models/file-response.schema';
import { fileBodySchema } from '../../../local-files/models/file-body.schema';
import { MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@ApiTags('Product ratings')
@Features('Product ratings', 'Product rating photos')
@Controller('products/:productId/ratings/:id/photos')
export class ProductRatingPhotosController {
  constructor(
    private readonly productRatingPhotosService: ProductRatingPhotosService,
  ) {}

  @Get(':photoId')
  @ApiOkResponse({
    schema: fileResponseSchema,
    description: 'Product rating photo with given id',
  })
  @ApiProduces('image/*')
  @ApiNotFoundResponse({ description: 'Product rating photo not found' })
  async getProductRatingPhoto(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) ratingId: number,
    @Param('photoId', ParseIntPipe) photoId: number,
    @Query('thumbnail', ParseBoolPipe) thumbnail: boolean,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    await this.productRatingPhotosService.getProductRatingPhoto(
      productId,
      ratingId,
      photoId,
      thumbnail,
      res,
    );
  }

  @Post()
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  @ApiUnauthorizedResponse({ description: 'User not logged in' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @ApiNotFoundResponse({ description: 'Product rating not found' })
  @ApiCreatedResponse({
    type: ProductRating,
    description: 'Product rating photo added',
  })
  @ApiBody({ schema: fileBodySchema })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async addProductRatingPhoto(
    @ReqUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) ratingId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(png|jpe?g|gif|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ProductRating> {
    const isUserAuthorized =
      await this.productRatingPhotosService.checkProductRatingUser(
        ratingId,
        user.id,
      );
    if (!isUserAuthorized && user.role === Role.Customer) {
      throw new ForbiddenException('Access denied');
    }
    return this.productRatingPhotosService.addProductRatingPhoto(
      productId,
      ratingId,
      file,
    );
  }

  @Delete(':photoId')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  @ApiUnauthorizedResponse({ description: 'User not logged in' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  @ApiNotFoundResponse({ description: 'Product rating not found' })
  @ApiOkResponse({
    type: ProductRating,
    description: 'Product rating photo deleted',
  })
  async deleteProductRatingPhoto(
    @ReqUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) ratingId: number,
    @Param('photoId', ParseIntPipe) photoId: number,
  ): Promise<ProductRating> {
    const isUserAuthorized =
      await this.productRatingPhotosService.checkProductRatingUser(
        ratingId,
        user.id,
      );
    if (!isUserAuthorized && user.role === Role.Customer) {
      throw new ForbiddenException('Access denied');
    }
    return this.productRatingPhotosService.deleteProductRatingPhoto(
      productId,
      ratingId,
      photoId,
    );
  }
}
