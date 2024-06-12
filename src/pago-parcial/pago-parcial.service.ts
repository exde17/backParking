import { Injectable } from '@nestjs/common';
import { CreatePagoParcialDto } from './dto/create-pago-parcial.dto';
import { UpdatePagoParcialDto } from './dto/update-pago-parcial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoParcial } from './entities/pago-parcial.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagoParcialService {
  constructor(
    @InjectRepository(PagoParcial)
    private readonly pagoParcialRepository: Repository <PagoParcial>
  ){}
  async create(createPagoParcialDto: CreatePagoParcialDto) {
    try {
      const pago = this.pagoParcialRepository.create(createPagoParcialDto)
      await this.pagoParcialRepository.save(pago)
      return{
        message: 'Pago creado con exito',
        // pago
      }
    } catch (error) {
      return{
        message: 'Error al crear el pago',
        error
      }
      
    }
  }

  async findAll() {
    try {
      return await this.pagoParcialRepository.find()
    } catch (error) {
      return{
        message: 'Error al obtener los pagos',
        error
      }
      
    }
    
  }

  async findOne(id: string) {
    try {
      return await this.pagoParcialRepository.findOne({
        where: {id}
      
      })
    } catch (error) {
      return{
        message: 'Error al obtener el pago',
        error
      }
      
    }
  }

  async update(id: string, updatePagoParcialDto: UpdatePagoParcialDto) {
    try {
      await this.pagoParcialRepository.update(id, updatePagoParcialDto)
      return{
        message: 'Pago actualizado con exito'
      }
    } catch (error) {
      return{
        message: 'Error al actualizar el pago',
        error
      }
      
    }
  }

  async remove(id: string) {
    try {
      await this.pagoParcialRepository.delete(id)
      return{
        message: 'Pago eliminado con exito'
      }
    } catch (error) {
      return{
        message: 'Error al eliminar el pago',
        error
      }
      
    }
  }
}
