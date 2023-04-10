import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlatformTokensService } from './platform-tokens.service';
import { CreatePlatformTokenDto } from './dto/create-platform-token.dto';
import { UpdatePlatformTokenDto } from './dto/update-platform-token.dto';

@Controller('platform-tokens')
export class PlatformTokensController {
  constructor(private readonly platformTokensService: PlatformTokensService) {}

  @Post()
  create(@Body() createPlatformTokenDto: CreatePlatformTokenDto) {
    return this.platformTokensService.create(createPlatformTokenDto);
  }

  @Get()
  findAll() {
    return this.platformTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlatformTokenDto: UpdatePlatformTokenDto) {
    return this.platformTokensService.update(+id, updatePlatformTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformTokensService.remove(+id);
  }
}
