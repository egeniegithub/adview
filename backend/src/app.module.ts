import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'adviewdbuser',
      password: 'C0Cb@)z;qm6T',
      database: 'adviewdb',
      entities: [ClientDatum, PlatformToken],
      synchronize: true,
    }),
    GoogleAdsApisModule,
    BingAdsModule,
    ClientDataModule,
    PlatformTokensModule,
    LinkedinAdsModule,
    MetaAdsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
