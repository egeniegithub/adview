import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';

@Controller('meta-ads')
export class MetaAdsController {
  constructor(private readonly metaAdsService: MetaAdsService) {}

  @Post()
  create(@Body() createMetaAdDto: CreateMetaAdDto) {
    return this.metaAdsService.create(createMetaAdDto);
  }

  @Get()
  findAll() {
    return this.metaAdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metaAdsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetaAdDto: UpdateMetaAdDto) {
    return this.metaAdsService.update(+id, updateMetaAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaAdsService.remove(+id);
  }
}
