import { Module } from '@nestjs/common';
import { AdsDataCronJobService } from './ads-data-cron-job.service';
import { AdsDataCronJobController } from './ads-data-cron-job.controller';
import { MetaAdsModule } from 'src/meta-ads/meta-ads.module';
import { ClientDataModule } from 'src/client-data/client-data.module';
import { LinkedinAdsModule } from 'src/linkedin-ads/linkedin-ads.module';
import { BingAdsModule } from 'src/bing-ads/bing-ads.module';
import { GoogleAdsApisModule } from 'src/google-ads-apis/google-ads-apis.module';

@Module({
  imports :[MetaAdsModule,ClientDataModule,LinkedinAdsModule,BingAdsModule,GoogleAdsApisModule],
  controllers: [AdsDataCronJobController],
  providers: [AdsDataCronJobService]
})
export class AdsDataCronJobModule {}
