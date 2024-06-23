import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoMaDto } from './create-pago-ma.dto';

export class UpdatePagoMaDto extends PartialType(CreatePagoMaDto) {}
