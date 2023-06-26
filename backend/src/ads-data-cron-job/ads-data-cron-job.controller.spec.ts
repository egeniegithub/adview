import { Test, TestingModule } from '@nestjs/testing';
import { AdsDataCronJobController } from './ads-data-cron-job.controller';
import { AdsDataCronJobService } from './ads-data-cron-job.service';

describe('AdsDataCronJobController', () => {
  let controller: AdsDataCronJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdsDataCronJobController],
      providers: [AdsDataCronJobService],
    }).compile();

    controller = module.get<AdsDataCronJobController>(AdsDataCronJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
