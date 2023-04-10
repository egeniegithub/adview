import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkedinAdDto } from './create-linkedin-ad.dto';

export class UpdateLinkedinAdDto extends PartialType(CreateLinkedinAdDto) {}
