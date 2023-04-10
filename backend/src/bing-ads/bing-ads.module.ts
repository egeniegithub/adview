import { Module } from '@nestjs/common';
import { BingAdsService } from './bing-ads.service';
import { BingAdsController } from './bing-ads.controller';

@Module({
  controllers: [BingAdsController],
  providers: [BingAdsService]
})
export class BingAdsModule {}
