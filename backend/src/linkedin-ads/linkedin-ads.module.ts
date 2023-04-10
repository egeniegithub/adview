import { Module } from '@nestjs/common';
import { LinkedinAdsService } from './linkedin-ads.service';
import { LinkedinAdsController } from './linkedin-ads.controller';

@Module({
  controllers: [LinkedinAdsController],
  providers: [LinkedinAdsService]
})
export class LinkedinAdsModule {}
