import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkedinAdsService } from './linkedin-ads.service';
import { CreateLinkedinAdDto } from './dto/create-linkedin-ad.dto';
import { UpdateLinkedinAdDto } from './dto/update-linkedin-ad.dto';

@Controller('linkedin-ads')
export class LinkedinAdsController {
  constructor(private readonly linkedinAdsService: LinkedinAdsService) {}

  @Get('/ObtainLinkedinAdsData/:email/:token')
  ObtainLinkedinAdsData(@Param('email') email: string,@Param('token') token:string) {
    try {
      return this.linkedinAdsService.ObtainLinkedInAdsData(email,token);
    } catch (error) {
      return error;
    }
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
