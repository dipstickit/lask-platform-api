import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../users/models/role.enum';
import { Product } from '../models/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductPhotosService } from './product-photos.service';
import { fileBodySchema } from '../../../local-files/models/file-body.schema';
import { fileResponseSchema } from '../../../local-files/models/file-response.schema';

@ApiTags('Products')
@Controller('products/:id')
export class ProductPhotosController {
  constructor(private productPhotosService: ProductPhotosService) {}

  @Get('photos/:photoId')
  @ApiOkResponse({
    schema: fileResponseSchema,
    description: 'Product photo with given id',
  })
  @ApiProduces('image/*')
  async getProductPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('photoId', ParseIntPipe) photoId: number,
    @Query('thumbnail', ParseBoolPipe) thumbnail: boolean,
    @Response() res,
  ): Promise<void> {
    return await this.productPhotosService.getProductPhoto(
      id,
      photoId,
      thumbnail,
      res,
    );
  }

  @Post('photos')
  @Roles(Role.Admin, Role.Manager)
  @ApiBody({ schema: fileBodySchema })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async addProductPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: /^image\/(png|jpe?g|gif|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Product> {
    return await this.productPhotosService.addProductPhoto(id, file);
  }

  @Delete('photos/:photoId')
  @Roles(Role.Admin, Role.Manager)
  async deleteProductPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('photoId', ParseIntPipe) photoId: number,
  ): Promise<Product> {
    return await this.productPhotosService.deleteProductPhoto(id, photoId);
  }
}
