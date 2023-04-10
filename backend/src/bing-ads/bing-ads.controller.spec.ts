import { Test, TestingModule } from '@nestjs/testing';
import { BingAdsController } from './bing-ads.controller';
import { BingAdsService } from './bing-ads.service';

describe('BingAdsController', () => {
  let controller: BingAdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BingAdsController],
      providers: [BingAdsService],
    }).compile();

    controller = module.get<BingAdsController>(BingAdsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
