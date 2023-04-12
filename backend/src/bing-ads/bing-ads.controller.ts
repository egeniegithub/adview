import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BingAdsService } from './bing-ads.service';
import { CreateBingAdDto } from './dto/create-bing-ad.dto';
import { UpdateBingAdDto } from './dto/update-bing-ad.dto';

@Controller('bing-ads')
export class BingAdsController {
  constructor(private readonly bingAdsService: BingAdsService) {}

  @Get('/ObtainLinkedinAdsData/:email')
  ObtainBingAdsData(@Param('email') email: string) {
    return this.bingAdsService.ObtainBingAdsData(email);
  }
  @Post()
  create(@Body() createBingAdDto: CreateBingAdDto) {
    return this.bingAdsService.create(createBingAdDto);
  }

  @Get()
  findAll() {
    return this.bingAdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bingAdsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBingAdDto: UpdateBingAdDto) {
    return this.bingAdsService.update(+id, updateBingAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bingAdsService.remove(+id);
  }
}
