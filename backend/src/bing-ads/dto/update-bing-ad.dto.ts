import { PartialType } from '@nestjs/mapped-types';
import { CreateBingAdDto } from './create-bing-ad.dto';

export class UpdateBingAdDto extends PartialType(CreateBingAdDto) {}
