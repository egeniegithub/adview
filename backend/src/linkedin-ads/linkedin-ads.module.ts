import { Module } from '@nestjs/common';
import { LinkedinAdsService } from './linkedin-ads.service';
import { LinkedinAdsController } from './linkedin-ads.controller';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDataModule } from 'src/client-data/client-data.module';


@Module({
  imports: [ClientDataModule],
  controllers: [LinkedinAdsController],
  providers: [LinkedinAdsService]
})
export class LinkedinAdsModule {}
