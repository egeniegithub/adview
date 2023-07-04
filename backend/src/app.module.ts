import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleAdsApisModule } from './google-ads-apis/google-ads-apis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BingAdsModule } from './bing-ads/bing-ads.module';
import { ClientDataModule } from './client-data/client-data.module';
import { PlatformTokensModule } from './platform-tokens/platform-tokens.module';
import { LinkedinAdsModule } from './linkedin-ads/linkedin-ads.module';
import { MetaAdsModule } from './meta-ads/meta-ads.module';
import { ClientDatum } from './client-data/entities/client-datum.entity';
import { PlatformToken } from './platform-tokens/entities/platform-token.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientMonthlyDatum } from './client-data/entities/client-monthly-datum.entity';
import { AdsDataCronJobModule } from './ads-data-cron-job/ads-data-cron-job.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.104.29.37',
      port: 3306,
      username: 'adviewio_api',
      password: '-p(MX?D.pmxx',
      database: 'adviewio_api',
      entities: [ClientDatum, PlatformToken,ClientMonthlyDatum],
      synchronize: true,
    }),
    HttpModule.register({
      baseURL: 'https://api.adview.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
    }),
    ScheduleModule.forRoot(),
    GoogleAdsApisModule,
    BingAdsModule,
    ClientDataModule,
    PlatformTokensModule,
    LinkedinAdsModule,
    MetaAdsModule,
    AdsDataCronJobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
