import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleAdsApiDto } from './create-google-ads-api.dto';

export class UpdateGoogleAdsApiDto extends PartialType(CreateGoogleAdsApiDto) {}
