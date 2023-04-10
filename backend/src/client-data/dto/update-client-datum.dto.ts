import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDatumDto } from './create-client-datum.dto';

export class UpdateClientDatumDto extends PartialType(CreateClientDatumDto) {}
