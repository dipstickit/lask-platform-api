import { Injectable } from '@nestjs/common';
import { ProductPhoto } from './models/product-photo.entity';
import { ProductPhotosService } from './product-photos.service';
import { Exporter } from '../../../import-export/models/exporter.interface';
import * as mime from 'mime-types';

@Injectable()
export class ProductPhotosExporter implements Exporter<any> {
  constructor(private readonly productPhotosService: ProductPhotosService) {}

  async export(): Promise<any[]> {
    const productPhotos = await this.productPhotosService.getProductPhotos();
    productPhotos.sort((a, b) => {
      if (a.product.id !== b.product.id) {
        return a.product.id - b.product.id;
      }
      const photosOrder = a.product.photosOrder.split(',');
      return (
        photosOrder.indexOf(a.id.toString()) -
        photosOrder.indexOf(b.id.toString())
      );
    });

    return productPhotos.map(this.prepareProductPhoto);
  }

  private prepareProductPhoto(productPhoto: ProductPhoto): any {
    return {
      id: productPhoto.id,
      productId: productPhoto.product.id,
      path: `${productPhoto.path}.${mime.extension(productPhoto.mimeType)}`,
      mimeType: productPhoto.mimeType,
    };
  }
}
