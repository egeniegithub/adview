import { Module } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { ClientDataController } from './client-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDatum } from './entities/client-datum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientDatum])],
  controllers: [ClientDataController],
  providers: [ClientDataService]
})
export class ClientDataModule {}
