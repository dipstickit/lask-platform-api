import { Test, TestingModule } from '@nestjs/testing';
import { ProductRatingPhotosController } from './product-rating-photos.controller';
import { ProductRatingPhotosService } from './product-rating-photos.service';

describe('ProductRatingPhotosController', () => {
  let controller: ProductRatingPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductRatingPhotosController],
      providers: [ProductRatingPhotosService],
    }).compile();

    controller = module.get<ProductRatingPhotosController>(ProductRatingPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
