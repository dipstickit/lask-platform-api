import { Test, TestingModule } from '@nestjs/testing';
import { ProductRatingPhotosService } from './product-rating-photos.service';

describe('ProductRatingPhotosService', () => {
  let service: ProductRatingPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRatingPhotosService],
    }).compile();

    service = module.get<ProductRatingPhotosService>(ProductRatingPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
