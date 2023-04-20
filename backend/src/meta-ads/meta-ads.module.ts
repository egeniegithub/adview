import { Module } from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { MetaAdsController } from './meta-ads.controller';
import { ClientDataModule } from 'src/client-data/client-data.module';

@Module({
  imports: [ClientDataModule],
  controllers: [MetaAdsController],
  providers: [MetaAdsService]
})
export class MetaAdsModule {}
