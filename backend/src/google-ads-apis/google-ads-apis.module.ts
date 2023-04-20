import { Module } from '@nestjs/common';
import { GoogleAdsApisService } from './google-ads-apis.service';
import { GoogleAdsApisController } from './google-ads-apis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDataModule } from 'src/client-data/client-data.module';


@Module({
  imports: [ClientDataModule,],
  controllers: [GoogleAdsApisController],
  providers: [GoogleAdsApisService],
})
export class GoogleAdsApisModule { }
