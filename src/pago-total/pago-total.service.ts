import { Injectable } from '@nestjs/common';
import { CreatePagoTotalDto } from './dto/create-pago-total.dto';
import { UpdatePagoTotalDto } from './dto/update-pago-total.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoTotal } from './entities/pago-total.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagoTotalService {
  constructor(
    @InjectRepository(PagoTotal)
    private readonly pagoTotalRepository: Repository <PagoTotal>
  ){}
  async create(createPagoTotalDto: CreatePagoTotalDto) {
    try {
      const pago = this.pagoTotalRepository.create(createPagoTotalDto)
      await this.pagoTotalRepository.save(pago)

      return{
        message: 'Pago creado con exito',
        // pago
      }
    } catch (error) {
      return{
        message: 'Error en la creacion del pago',
        error
      }
      
    }
  }

  async findAll() {
    try {
      return await this.pagoTotalRepository.find({
        relations: ['cliente'],
        select: {
          cliente: {
            id: true,
            nombre: true,
            apellido: true
          },
          valor: true,
          createdAt: true
        }
      })
    } catch (error) {
      return{
        message: 'Error en la obtencion de pagos',
        error
      }
      
    }
  }

  async findOne(id: string) {
    try {
      return await this.pagoTotalRepository.findOne({
        where: {id}
      })
    } catch (error) {
      return{
        message: 'Error en la obtencion de pago',
        error
      }
      
    }
  }

  async update(id: string, updatePagoTotalDto: UpdatePagoTotalDto) {
    try {
      await this.pagoTotalRepository.update(id, updatePagoTotalDto)
      return{
        message: 'Pago actualizado con exito',
        // pago
      }
      
    } catch (error) {
      return{
        message: 'Error en la actualizacion del pago',
        error
      }
      
    }
  }

  async remove(id: string) {
    try {
      await this.pagoTotalRepository.delete(id)
      return{
        message: 'Pago eliminado con exito'
      }
    } catch (error) {
      return{
        message: 'Error en la eliminacion del pago',
        error
      }
      
    }
  }
}
