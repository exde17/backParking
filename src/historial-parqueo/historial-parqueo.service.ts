import { Injectable } from '@nestjs/common';
import { CreateHistorialParqueoDto } from './dto/create-historial-parqueo.dto';
import { UpdateHistorialParqueoDto } from './dto/update-historial-parqueo.dto';

@Injectable()
export class HistorialParqueoService {
  create(createHistorialParqueoDto: CreateHistorialParqueoDto) {
    return 'This action adds a new historialParqueo';
  }

  findAll() {
    return `This action returns all historialParqueo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialParqueo`;
  }

  update(id: number, updateHistorialParqueoDto: UpdateHistorialParqueoDto) {
    return `This action updates a #${id} historialParqueo`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialParqueo`;
  }
}
