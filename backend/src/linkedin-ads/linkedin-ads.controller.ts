import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkedinAdsService } from './linkedin-ads.service';
import { CreateLinkedinAdDto } from './dto/create-linkedin-ad.dto';
import { UpdateLinkedinAdDto } from './dto/update-linkedin-ad.dto';


export class ObtainLinkedinAdsDataDto {
  customer_ids: string
  email: string
  customer_names: string
  refresh_token: string
  access_token: string
  customers ?: []
}


@Controller('linkedin-ads')
export class LinkedinAdsController {
  constructor(private readonly linkedinAdsService: LinkedinAdsService) { }

  @Post('/ObtainLinkedinAdsData')
  ObtainAdsData(@Body() ObtainLinkedinAdsDataDto: ObtainLinkedinAdsDataDto) {
    try {
      return this.linkedinAdsService.ObtainLinkedInAdsData(ObtainLinkedinAdsDataDto);
    } catch (error) {
      return error;
    }
  }

  @Get('/logout-user/:email')
  handleLinkedinLogout(@Param('email') email: string) {
    return this.linkedinAdsService.handleLinkedinLogout(email);
  }

  @Get('/getManagerActDetails/:token')
  GetMangerActInfo(@Param('token') token: string) {
    return this.linkedinAdsService.getLinkedActs(token);
  }

  @Get('/unlink-customer/:id/:email')
  handleUnlinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.linkedinAdsService.handleUnlinkCustomer(id, email);
  }

  @Get('/relink-customer/:id/:email')
  handleRelinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.linkedinAdsService.handleRelinkCustomer(id, email);
  }


  @Post()
  create(@Body() createLinkedinAdDto: CreateLinkedinAdDto) {
    return this.linkedinAdsService.create(createLinkedinAdDto);
  }

  @Get()
  findAll() {
    return this.linkedinAdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkedinAdsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkedinAdDto: UpdateLinkedinAdDto) {
    return this.linkedinAdsService.update(+id, updateLinkedinAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkedinAdsService.remove(+id);
  }
}
