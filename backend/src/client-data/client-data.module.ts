import { Module } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { ClientDataController } from './client-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDatum } from './entities/client-datum.entity';
import { ClientMonthlyDatum } from './entities/client-monthly-datum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientDatum,ClientMonthlyDatum])],
  controllers: [ClientDataController],
  providers: [ClientDataService],
  exports: [ClientDataService],
})
export class ClientDataModule {}
