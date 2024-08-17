import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPhoto } from './models/product-photo.entity';
import { Product } from '../models/product.entity';
import { LocalFilesService } from '../../../local-files/local-files.service';
import { NotFoundError } from '../../../errors/not-found.error';
import { Response } from 'express';

@Injectable()
export class ProductPhotosService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductPhoto)
    private readonly productPhotosRepository: Repository<ProductPhoto>,
    private readonly localFilesService: LocalFilesService,
  ) {}

  async getProductPhotos(): Promise<ProductPhoto[]> {
    return this.productPhotosRepository.find({
      relations: ['product'],
    });
  }

  async getProductPhoto(
    productId: number,
    photoId: number,
    thumbnail: boolean,
    res: Response,
  ): Promise<void> {
    const productPhoto = await this.productPhotosRepository.findOne({
      where: { id: photoId, product: { id: productId } },
    });
    if (!productPhoto) {
      throw new NotFoundError('product photo', 'id', photoId.toString());
    }

    const filepath = thumbnail ? productPhoto.thumbnailPath : productPhoto.path;
    const mimeType = thumbnail ? 'image/jpeg' : productPhoto.mimeType;

    const photoStream = await this.localFilesService.getPhoto(
      filepath,
      mimeType,
    );
    photoStream.pipe(res);
  }

  async createProductPhoto(
    productId: number,
    path: string,
    mimeType: string,
  ): Promise<ProductPhoto> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundError('product', 'id', productId.toString());
    }

    const photo = new ProductPhoto();
    photo.path = path;
    photo.mimeType = mimeType;
    photo.thumbnailPath =
      await this.localFilesService.createPhotoThumbnail(path);
    photo.placeholderBase64 =
      await this.localFilesService.createPhotoPlaceholder(path);

    product.photos.push(photo);
    await this.updateProductPhotosOrder(product, photo.id);

    return photo;
  }

  async addProductPhoto(
    productId: number,
    file: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundError('product', 'id', productId.toString());
    }

    const { path, mimeType } = await this.localFilesService.savePhoto(file);

    const photo = new ProductPhoto();
    photo.path = path;
    photo.mimeType = mimeType;
    photo.thumbnailPath =
      await this.localFilesService.createPhotoThumbnail(path);
    photo.placeholderBase64 =
      await this.localFilesService.createPhotoPlaceholder(path);

    product.photos.push(photo);
    await this.updateProductPhotosOrder(product, photo.id);

    return product;
  }

  async deleteProductPhoto(
    productId: number,
    photoId: number,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundError('product', 'id', productId.toString());
    }

    product.photos = product.photos.filter((photo) => photo.id !== photoId);
    await this.updateProductPhotosOrder(product, null, photoId);

    return product;
  }

  private async updateProductPhotosOrder(
    product: Product,
    photoId: number | null,
    photoToRemoveId?: number,
  ): Promise<void> {
    if (photoId !== null) {
      product.photosOrder = product.photosOrder
        ? [...product.photosOrder.split(','), photoId.toString()].join(',')
        : photoId.toString();
    } else if (photoToRemoveId) {
      product.photosOrder = product.photosOrder
        .split(',')
        .filter((id) => id !== photoToRemoveId.toString())
        .join(',');
    }
    await this.productsRepository.save(product);
  }
}
