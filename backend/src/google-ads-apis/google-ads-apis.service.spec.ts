import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAdsApisService } from './google-ads-apis.service';

describe('GoogleAdsApisService', () => {
  let service: GoogleAdsApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAdsApisService],
    }).compile();

    service = module.get<GoogleAdsApisService>(GoogleAdsApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
