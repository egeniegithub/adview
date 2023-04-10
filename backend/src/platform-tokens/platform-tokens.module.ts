import { Module } from '@nestjs/common';
import { PlatformTokensService } from './platform-tokens.service';
import { PlatformTokensController } from './platform-tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformToken } from './entities/platform-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformToken])],
  controllers: [PlatformTokensController],
  providers: [PlatformTokensService]
})
export class PlatformTokensModule {}
