import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';

export class ObtainMetaAdsDataDto {
  access_token:string
  customer_ids:string
  email:string
  customer_names:string
  refresh_token:string
  customers ?: []
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
  handleUnlinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.metaAdsService.handleUnlinkCustomer(id,email);
  }

  @Get('/relink-customer/:id/:email')
  handleRelinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.metaAdsService.handleRelinkCustomer(id,email);
  }

  @Get('/logout-user/:email')
  handleMetaLogout(@Param('email') email: string) {
    return this.metaAdsService.handleMetaLogout(email);
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
