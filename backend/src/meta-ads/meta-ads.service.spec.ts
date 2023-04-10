import { Test, TestingModule } from '@nestjs/testing';
import { MetaAdsService } from './meta-ads.service';

describe('MetaAdsService', () => {
  let service: MetaAdsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetaAdsService],
    }).compile();

    service = module.get<MetaAdsService>(MetaAdsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
