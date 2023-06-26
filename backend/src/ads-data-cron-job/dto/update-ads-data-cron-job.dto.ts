import { PartialType } from '@nestjs/mapped-types';
import { CreateAdsDataCronJobDto } from './create-ads-data-cron-job.dto';

export class UpdateAdsDataCronJobDto extends PartialType(CreateAdsDataCronJobDto) {}
