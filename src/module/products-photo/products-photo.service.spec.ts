import { Test, TestingModule } from '@nestjs/testing';
import { ProductsPhotoService } from './products-photo.service';

describe('ProductsPhotoService', () => {
  let service: ProductsPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsPhotoService],
    }).compile();

    service = module.get<ProductsPhotoService>(ProductsPhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
