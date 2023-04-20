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
import { CreateGoogleAdsApiDto } from './dto/create-google-ads-api.dto';
import { UpdateGoogleAdsApiDto } from './dto/update-google-ads-api.dto';

@Controller('google-ads-apis')
export class GoogleAdsApisController {
  constructor(private readonly googleAdsApisService: GoogleAdsApisService) { }


  @Get('/ObtainAdsData/:email/:token')
  ObtainAdsData(@Param('email') email: string,@Param('token') token:string) {
    try {
      return this.googleAdsApisService.ObtainAdsData(email,token);
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
