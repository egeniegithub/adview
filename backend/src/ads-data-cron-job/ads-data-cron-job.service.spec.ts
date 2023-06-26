import { Test, TestingModule } from '@nestjs/testing';
import { AdsDataCronJobService } from './ads-data-cron-job.service';

describe('AdsDataCronJobService', () => {
  let service: AdsDataCronJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdsDataCronJobService],
    }).compile();

    service = module.get<AdsDataCronJobService>(AdsDataCronJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
