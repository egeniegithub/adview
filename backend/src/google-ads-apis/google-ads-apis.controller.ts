import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GoogleAdsApisService } from './google-ads-apis.service';
import { CreateGoogleAdsApiDto, ObtainAdsDataDto } from './dto/create-google-ads-api.dto';
import { UpdateGoogleAdsApiDto } from './dto/update-google-ads-api.dto';

@Controller('google-ads-apis')
export class GoogleAdsApisController {
  constructor(private readonly googleAdsApisService: GoogleAdsApisService) { }


  @Post('/ObtainAdsData')
  ObtainAdsData(@Body() ObtainAdsDataDto: ObtainAdsDataDto) {
    try {
      return this.googleAdsApisService.ObtainAdsData(ObtainAdsDataDto);
    } catch (error) {
      return error;
    }
  }

  @Post('/generateAccessToken')
  GenerateAccessToken(@Body() refresh_token: string) {
    try {
      return this.googleAdsApisService.generateAccessToken(refresh_token);
    } catch (error) {
      return error;
    }
  }
  @Get('/unlink-customer/:id/:email')
  hanldeUnlinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.googleAdsApisService.hanldeUnlinkCustomer(id,email);
  }

  @Get('/relink-customer/:id/:email')
  hanldeRelinkCustomer(@Param('id') id: string, @Param('email') email: string) {
    return this.googleAdsApisService.hanldeRelinkCustomer(id,email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleAdsApisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() UpdateGoogleAdsApiDto: UpdateGoogleAdsApiDto
  ) {
    return this.googleAdsApisService.update(+id, UpdateGoogleAdsApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleAdsApisService.remove(+id);
  }
}
