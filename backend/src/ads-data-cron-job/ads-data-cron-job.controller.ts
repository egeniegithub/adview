import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdsDataCronJobService } from './ads-data-cron-job.service';
import { CreateAdsDataCronJobDto } from './dto/create-ads-data-cron-job.dto';
import { UpdateAdsDataCronJobDto } from './dto/update-ads-data-cron-job.dto';

@Controller('ads-data-cron-job')
export class AdsDataCronJobController {
  constructor(private readonly adsDataCronJobService: AdsDataCronJobService) {}

  @Post()
  create(@Body() createAdsDataCronJobDto: CreateAdsDataCronJobDto) {
    return this.adsDataCronJobService.create(createAdsDataCronJobDto);
  }

  @Get('get-all')
  ClientadsUpdateCroneJob() {
    return this.adsDataCronJobService.ClientadsUpdateCroneJob();
  }

  @Post('get-refresh-token')
  GoogleExchangeRefreshToken(@Body() token: any) {
    return this.adsDataCronJobService.GoogleExchangeRefreshToken(token.text);
  }

  @Post('covert-bing-refresh-token')
  CovertBingRefreshToken(@Body() token: any) {
    return this.adsDataCronJobService.CovertBingRefreshToken(token.text);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsDataCronJobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdsDataCronJobDto: UpdateAdsDataCronJobDto) {
    return this.adsDataCronJobService.update(+id, updateAdsDataCronJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsDataCronJobService.remove(+id);
  }
}
