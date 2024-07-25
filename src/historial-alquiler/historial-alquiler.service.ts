import { Injectable } from '@nestjs/common';
import { CreateHistorialAlquilerDto } from './dto/create-historial-alquiler.dto';
import { UpdateHistorialAlquilerDto } from './dto/update-historial-alquiler.dto';

@Injectable()
export class HistorialAlquilerService {
  create(createHistorialAlquilerDto: CreateHistorialAlquilerDto) {
    return 'This action adds a new historialAlquiler';
  }

  findAll() {
    return `This action returns all historialAlquiler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialAlquiler`;
  }

  update(id: number, updateHistorialAlquilerDto: UpdateHistorialAlquilerDto) {
    return `This action updates a #${id} historialAlquiler`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialAlquiler`;
  }
}
