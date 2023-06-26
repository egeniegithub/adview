import { Module } from '@nestjs/common';
import { AdsDataCronJobService } from './ads-data-cron-job.service';
import { AdsDataCronJobController } from './ads-data-cron-job.controller';
import { MetaAdsModule } from 'src/meta-ads/meta-ads.module';
import { ClientDataModule } from 'src/client-data/client-data.module';

@Module({
  imports :[MetaAdsModule,ClientDataModule],
  controllers: [AdsDataCronJobController],
  providers: [AdsDataCronJobService]
})
export class AdsDataCronJobModule {}
