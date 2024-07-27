import { Injectable } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Historial } from './entities/historial.entity';
import { Between, Repository } from 'typeorm';
import { format } from 'date-fns';
import { FiltroFechaDto } from './dto/filtroFecha.dto';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private historialRepository: Repository<Historial>,
  ) {}
  create(createHistorialDto: CreateHistorialDto) {
    return 'This action adds a new historial';
  }

  async findAll() {
    try {
      const historiales = await this.historialRepository.find({
        relations: {
          cliente: true,
        },
        order: {
          createdAt: 'DESC'
        }
      });
  
      // Mapear los resultados para formatear la fecha y extraer solo los datos necesarios
      return historiales.map(historial => ({
        fechaCreacion: format(new Date(historial.createdAt), 'dd/MM/yyyy HH:mm'),
        valorPago: historial.valor,
        nombreCliente: historial.cliente.nombre
      }));
      
    } catch (error) {
      return {
        message: 'Error en el servidor',
        error: error
      };
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
  
      const historiales = await this.historialRepository.find({
        where: {
          createdAt: Between(startDate, endDate),
        },
        relations: {
          cliente: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
  
      // Mapear los resultados para formatear la fecha y extraer solo los datos necesarios
      for(let i=0; i< historiales.length; i++){
        suma += (+ historiales[i].valor)
      }

      const res= historiales.map(historial => ({
        fechaCreacion: format(new Date(historial.createdAt), 'dd/MM/yyyy HH:mm'),
        valorPago: historial.valor,
        nombreCliente: historial.cliente.nombre,
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

  findOne(id: number) {
    return `This action returns a #${id} historial`;
  }

  update(id: number, updateHistorialDto: UpdateHistorialDto) {
    return `This action updates a #${id} historial`;
  }

  remove(id: number) {
    return `This action removes a #${id} historial`;
  }
}
