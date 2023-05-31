import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';

export class ObtainMetaAdsDataDto {
  accessToken:string
  customer_ids:string
  email:string
}

@Controller('meta-ads')
export class MetaAdsController {
  constructor(private readonly metaAdsService: MetaAdsService) {}


  @Post('/ObtainMetaAdsData')
  ObtainAdsData(@Body() ObtainAdsDataDto: ObtainMetaAdsDataDto) {
    try {
      return this.metaAdsService.ObtainMetaAdsData(ObtainAdsDataDto);
    } catch (error) {
      return error;
    }
  }

  @Get('/unlink-customer/:id/:email')
  hanldeUnlinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.metaAdsService.hanldeUnlinkCustomer(id,email);
  }

  @Get('/relink-customer/:id/:email')
  hanldeRelinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.metaAdsService.hanldeRelinkCustomer(id,email);
  }

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
