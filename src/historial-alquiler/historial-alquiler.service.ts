import { Injectable } from '@nestjs/common';
import { CreateHistorialAlquilerDto } from './dto/create-historial-alquiler.dto';
import { UpdateHistorialAlquilerDto } from './dto/update-historial-alquiler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistorialAlquiler } from './entities/historial-alquiler.entity';
import { Repository } from 'typeorm';
import { Alquiler } from 'src/alquiler/entities/alquiler.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class HistorialAlquilerService {
  constructor(
    @InjectRepository(HistorialAlquiler)
    private readonly historyRepository: Repository <HistorialAlquiler>,
    @InjectRepository(Alquiler)
    private readonly alquilerRepository: Repository <Alquiler>,
    private dataSource: DataSource
  ){}

  // async create(createHistorialAlquilerDto: CreateHistorialAlquilerDto) {
  //   try {
  //     const alquiler = await this.alquilerRepository.findOne({
  //       where:{
  //         id: createHistorialAlquilerDto.idAlquiler
  //       }
  //     });

  //     if(!alquiler){
  //       return {
  //         throw: 'No se encontro el alquiler'
  //       }
  //     }

  //     const history = this.historyRepository.create({
  //       nombreCliente: alquiler.nombreCliente,
  //       tipo: alquiler.tipo,
  //       precio: alquiler.precio,
  //       fechaSalida: alquiler.entradadAt
  //     });

  //     await this.historyRepository.save(history);

  //     return {
  //       message: 'Historial de alquiler creado con exito'
  //     }

  //   } catch (error) {
  //     throw error
      
  //   }
  // }

  async create(createHistorialAlquilerDto: CreateHistorialAlquilerDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const alquiler = await queryRunner.manager.findOne(Alquiler, {
        where: { id: createHistorialAlquilerDto.idAlquiler },
      });
  
      if (!alquiler) {
        throw new Error('No se encontró el alquiler');
      }
  
      const history = queryRunner.manager.create(HistorialAlquiler, {
        nombreCliente: alquiler.nombreCliente,
        tipo: alquiler.tipo,
        precio: alquiler.precio,
        fechaSalida: alquiler.salidasAt,
      });
  
      await queryRunner.manager.save(history);
      await queryRunner.commitTransaction();
  
      return { message: 'Historial de alquiler creado con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
