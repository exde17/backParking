import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialParqueoDto } from './create-historial-parqueo.dto';

export class UpdateHistorialParqueoDto extends PartialType(CreateHistorialParqueoDto) {}
