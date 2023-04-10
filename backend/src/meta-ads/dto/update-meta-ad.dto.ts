import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaAdDto } from './create-meta-ad.dto';

export class UpdateMetaAdDto extends PartialType(CreateMetaAdDto) {}
