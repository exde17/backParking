import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialAlquilerDto } from './create-historial-alquiler.dto';

export class UpdateHistorialAlquilerDto extends PartialType(CreateHistorialAlquilerDto) {}
