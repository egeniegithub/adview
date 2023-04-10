import { PartialType } from '@nestjs/mapped-types';
import { CreatePlatformTokenDto } from './create-platform-token.dto';

export class UpdatePlatformTokenDto extends PartialType(CreatePlatformTokenDto) {}
