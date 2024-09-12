import { Test, TestingModule } from '@nestjs/testing';
import { VNPayService } from './vnpay.service';

describe('VnpayService', () => {
  let service: VNPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VNPayService],
    }).compile();

    service = module.get<VNPayService>(VNPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
