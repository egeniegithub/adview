import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAdsApisController } from './google-ads-apis.controller';
import { GoogleAdsApisService } from './google-ads-apis.service';

describe('GoogleAdsApisController', () => {
  let controller: GoogleAdsApisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAdsApisController],
      providers: [GoogleAdsApisService],
    }).compile();

    controller = module.get<GoogleAdsApisController>(GoogleAdsApisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
