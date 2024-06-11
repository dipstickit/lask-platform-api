import { Test, TestingModule } from '@nestjs/testing';
import { AttributeTypesController } from './attribute-types.controller';
import { AttributeTypesService } from './attribute-types.service';

describe('AttributeTypesController', () => {
  let controller: AttributeTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeTypesController],
      providers: [AttributeTypesService],
    }).compile();

    controller = module.get<AttributeTypesController>(AttributeTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
