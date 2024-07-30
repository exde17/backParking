import { Injectable } from '@nestjs/common';
import { CreateHistorialAlquilerDto } from './dto/create-historial-alquiler.dto';
import { UpdateHistorialAlquilerDto } from './dto/update-historial-alquiler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistorialAlquiler } from './entities/historial-alquiler.entity';
import { Between, Repository } from 'typeorm';
import { Alquiler } from 'src/alquiler/entities/alquiler.entity';
import { DataSource } from 'typeorm';
import { FiltroFechaDto } from 'src/historial/dto/filtroFecha.dto';
import { format } from 'date-fns';
import moment from 'moment-timezone';

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

  async create(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const alquiler = await queryRunner.manager.findOne(Alquiler, {
        where: { id },
      });
  
      if (!alquiler) {
        throw new Error('No se encontró el alquiler');
      }
  
      const history = queryRunner.manager.create(HistorialAlquiler, {
        nombreCliente: alquiler.nombreCliente,
        tipo: alquiler.tipo,
        precio: alquiler.precio,
        fechaSalida: alquiler.entradadAt,
      });
  
      await queryRunner.manager.save(history);

      //borro el alquiler
      // await queryRunner.manager.delete(Alquiler, id);

      //actualizar el estado del alquiler
      alquiler.isActive = false;
      //actualizo el estado de pendiente
      alquiler.pending = false;
      //actualizo el precio por si las moscas
      alquiler.precio = 5000;
      await queryRunner.manager.save(alquiler);

      await queryRunner.commitTransaction();
  
      return { message: 'Historial de alquiler creado con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.historyRepository.find();
    } catch (error) {
      return {
        message: 'Error al obtener historial de alquiler',
        error: error
      }
      
    }
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

  //suma de alquileres pagos del dia
  async sumaAlquileres() {
    // const moment = require('moment-timezone');
    let suma = 0;
    try {
      const pagosTotales = await this.historyRepository.find();
      // const fechaActual = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
      // Obtener la fecha y hora actual en la zona horaria de Colombia
      const fechaActual = moment.tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
  
      // const pagosDelDia = pagosTotales.filter((item) => {
      //   const fechaPago = new Date(item.fechaEntrega).toISOString().split('T')[0];
      //   return fechaPago === fechaActual;
      // });

      const pagosDelDia = pagosTotales.filter((item) => {
        const fechaPago = moment(item.fechaEntrega).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
        return fechaPago === fechaActual;
      });
  
      pagosDelDia.forEach((item) => {
        suma += +item.precio;
      });
  
      return {
        'totalPagos': suma.toLocaleString('es-ES')
      };
    } catch (error) {
      return error;
    }
  }

  //filtrar por fecha
  async findByDate(filtroFechaDto:FiltroFechaDto) {
    let suma = 0
    let x = []
    try {
      const {fecha, tipoFiltro} = filtroFechaDto;
      
      let startDate: Date;
      let endDate: Date;
  
      switch (tipoFiltro) {
        case 'dia':
          startDate = new Date(fecha.setHours(0, 0, 0, 0));
          endDate = new Date(fecha.setHours(23, 59, 59, 999));
          break;
        case 'mes':
          startDate = new Date(fecha.getFullYear(), fecha.getMonth(), 1, 0, 0, 0, 0);
          endDate = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'anio':
          startDate = new Date(fecha.getFullYear(), 0, 1, 0, 0, 0, 0);
          endDate = new Date(fecha.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
        default:
          throw new Error('Tipo de filtro no válido');
      }
  
      const historiales = await this.historyRepository.find({
        where: {
          fechaEntrega: Between(startDate, endDate),
        },
        order: {
          fechaEntrega: 'DESC',
        },
      });
  
      // Mapear los resultados para formatear la fecha y extraer solo los datos necesarios
      for(let i=0; i< historiales.length; i++){
        suma += (+ historiales[i].precio)
      }

      const res= historiales.map(historial => ({
        fechaCreacion: format(new Date(historial.fechaEntrega), 'dd/MM/yyyy HH:mm'),
        valorPago: historial.precio,
        nombreCliente: historial.nombreCliente,
      }));

      return{
        data: res,
        total: suma.toLocaleString('es-ES')
      }
  
    } catch (error) {
      return {
        message: 'Error en el servidor',
        error: error,
      };
    }
  }
}
