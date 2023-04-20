import { Module } from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { MetaAdsController } from './meta-ads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientDatum])],
  controllers: [MetaAdsController],
  providers: [MetaAdsService]
})
export class MetaAdsModule {}
