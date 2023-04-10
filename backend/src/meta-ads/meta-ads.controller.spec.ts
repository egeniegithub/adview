import { Test, TestingModule } from '@nestjs/testing';
import { MetaAdsController } from './meta-ads.controller';
import { MetaAdsService } from './meta-ads.service';

describe('MetaAdsController', () => {
  let controller: MetaAdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaAdsController],
      providers: [MetaAdsService],
    }).compile();

    controller = module.get<MetaAdsController>(MetaAdsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
