import { Injectable } from '@nestjs/common';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alquiler } from './entities/alquiler.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlquilerService {
  @InjectRepository(Alquiler)
  private readonly alquilerRepository: Repository<Alquiler>;

  async create(createAlquilerDto: CreateAlquilerDto) {
    try {
      const alquiler = this.alquilerRepository.create(createAlquilerDto);
      await this.alquilerRepository.save(alquiler);

      return {
        message: 'Alquiler creado con exito'
      }
    } catch (error) {
      return {
        message: 'Error al crear alquiler',
        error: error
      }
      
    }
  }

  async findAll() {
    try {
      return await this.alquilerRepository.find({
        where: {
          isActive: true
        },
        order: {
          nombreCliente: 'ASC'
        }
      });
      
    } catch (error) {
      return {
        message: 'Error al obtener alquileres',
        error: error
      }
      
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.alquilerRepository.findOne({
        where: {
          id: id
        }
      });

      if(res){
        return res;
      }else{
        throw new Error('No se encontro alquiler');
      }
      
    } catch (error) {
      throw error
      
    }
  }

  async update(id: string, updateAlquilerDto: UpdateAlquilerDto) {
   
    try {
      await this.alquilerRepository.update(id, updateAlquilerDto);
      return {
        message: 'Alquiler actualizado con exito'
      }
    } catch (error) {
      return {
        message: 'Error al actualizar alquiler',
        error: error
      }
    }
  }

  async remove(id: string) {
    
    try {
      await this.alquilerRepository.delete(id);
      return {
        message: 'Alquiler eliminado con exito'
      }
    } catch (error) {
      return {
        message: 'Error al eliminar alquiler',
        error: error
      }
    }
  }

  //actualizar el estado de pendiente
  async updatePendiente(id: string) {
    try {
      const res = await this.alquilerRepository.findOne({
        where: {
          id: id
        }
      });
       res.pending = !res.pending;
      await this.alquilerRepository.save(res);
      return {
        message: 'Alquiler actualizado con exito'
      }
    } catch (error) {
      return {
        message: 'Error al actualizar alquiler',
        error: error
      }
    }
  }
}
