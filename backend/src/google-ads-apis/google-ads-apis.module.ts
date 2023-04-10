import { Module } from '@nestjs/common';
import { GoogleAdsApisService } from './google-ads-apis.service';
import { GoogleAdsApisController } from './google-ads-apis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [GoogleAdsApisController],
  providers: [GoogleAdsApisService],
})
export class GoogleAdsApisModule { }
