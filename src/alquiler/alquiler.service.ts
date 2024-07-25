import { Injectable } from '@nestjs/common';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';

@Injectable()
export class AlquilerService {
  create(createAlquilerDto: CreateAlquilerDto) {
    return 'This action adds a new alquiler';
  }

  findAll() {
    return `This action returns all alquiler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alquiler`;
  }

  update(id: number, updateAlquilerDto: UpdateAlquilerDto) {
    return `This action updates a #${id} alquiler`;
  }

  remove(id: number) {
    return `This action removes a #${id} alquiler`;
  }
}
