import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoParcialDto } from './create-pago-parcial.dto';

export class UpdatePagoParcialDto extends PartialType(CreatePagoParcialDto) {}
