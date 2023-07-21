import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BingAdsService } from './bing-ads.service';
import { CreateBingAdDto } from './dto/create-bing-ad.dto';
import { UpdateBingAdDto } from './dto/update-bing-ad.dto';

export class ObtainBingAdsDataDto {
  // accessToken:string
  customer_ids:string
  email:string
  customer_names:string
  manager_id:string
  refresh_token:string
  access_token:string 
  customers ?:[]
}

@Controller('bing-ads')
export class BingAdsController {
  
  constructor(
    private readonly bingAdsService: BingAdsService) {}

  @Post('/ObtainBingAdsData')
  ObtainAdsData(@Body() ObtainLinkedinAdsDataDto: ObtainBingAdsDataDto) {
    try {
      return this.bingAdsService.ObtainBingAdsData(ObtainLinkedinAdsDataDto);
    } catch (error) {
      return error;
    }
  }

  @Get('/logout-user/:email')
  handleBingLogout(@Param('email') email: string) {
    return this.bingAdsService.handleBingLogout(email);
  }


  @Post()
  create(@Body() createBingAdDto: CreateBingAdDto) {
    return this.bingAdsService.create(createBingAdDto);
  }

  @Get('/getManagerActDetails/:token')
  GetMangerActInfo(@Param('token') token:string) {
    return this.bingAdsService.GetMangerActInfo(token);
  }

  @Get('/unlink-customer/:id/:email')
  handleUnlinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.bingAdsService.handleUnlinkCustomer(id,email);
  }

  @Get('/relink-customer/:id/:email')
  handleRelinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.bingAdsService.handleRelinkCustomer(id,email);
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
