import { Module } from '@nestjs/common';
import { BingAdsService } from './bing-ads.service';
import { BingAdsController } from './bing-ads.controller';
import { ClientDataModule } from 'src/client-data/client-data.module';

@Module({
  imports: [ClientDataModule],
  controllers: [BingAdsController],
  providers: [BingAdsService]
})
export class BingAdsModule {}
