import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoTotalDto } from './create-pago-total.dto';

export class UpdatePagoTotalDto extends PartialType(CreatePagoTotalDto) {}
