import { Test, TestingModule } from '@nestjs/testing';
import { ProductsPhotoController } from './products-photo.controller';
import { ProductsPhotoService } from './products-photo.service';

describe('ProductsPhotoController', () => {
  let controller: ProductsPhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsPhotoController],
      providers: [ProductsPhotoService],
    }).compile();

    controller = module.get<ProductsPhotoController>(ProductsPhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
