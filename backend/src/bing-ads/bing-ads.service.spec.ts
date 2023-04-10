import { Test, TestingModule } from '@nestjs/testing';
import { BingAdsService } from './bing-ads.service';

describe('BingAdsService', () => {
  let service: BingAdsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BingAdsService],
    }).compile();

    service = module.get<BingAdsService>(BingAdsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
