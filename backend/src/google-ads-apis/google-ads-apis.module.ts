import { Module } from '@nestjs/common';
import { GoogleAdsApisService } from './google-ads-apis.service';
import { GoogleAdsApisController } from './google-ads-apis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ClientDatum])],
  controllers: [GoogleAdsApisController],
  providers: [GoogleAdsApisService],
})
export class GoogleAdsApisModule { }
