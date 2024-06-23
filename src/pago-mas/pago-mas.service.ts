import { Injectable } from '@nestjs/common';
import { CreatePagoMaDto } from './dto/create-pago-ma.dto';
import { UpdatePagoMaDto } from './dto/update-pago-ma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoMa } from './entities/pago-ma.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagoMasService {
  @InjectRepository(PagoMa)
  private readonly pagoMaRepository: Repository<PagoMa>;

  async create(createPagoMaDto: CreatePagoMaDto) {
    try {
      const pagoMa = this.pagoMaRepository.create(createPagoMaDto);
      await this.pagoMaRepository.save(pagoMa);

      return "PagoMa creado con éxito"
    } catch (error) {
      return error;
      
    }
  }

  async findAll() {
    try {
      return await this.pagoMaRepository.find();
      
    } catch (error) {
      return error;
      
    }
  }

  async findOne(id: string) {
    try {
      return await this.pagoMaRepository.findOne({
        where: {
          id
        }
      
      });
      
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updatePagoMaDto: UpdatePagoMaDto) {
    try {
      await this.pagoMaRepository.update(id, updatePagoMaDto);
      return "PagoMa actualizado con éxito"
      
    } catch (error) {
      return error;
      
    }
  }

  async remove(id: string) {
    try {
      await this.pagoMaRepository.delete(id);
      return "PagoMa eliminado con éxito"
      
    } catch (error) {
      return error;
      
    }
  }
}
