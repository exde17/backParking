import { Injectable } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Historial } from './entities/historial.entity';
import { Repository } from 'typeorm';
import { format } from 'date-fns';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private historialRepository: Repository<Historial>,
  ) {}
  create(createHistorialDto: CreateHistorialDto) {
    return 'This action adds a new historial';
  }

  // async findAll() {
  //   try {
  //     const historiales = await this.historialRepository.find({
  //       relations: {
  //         cliente: true,
  //       },
  //       order: {
  //         createdAt: 'DESC'
  //       }
  //     });
  
  //     // Mapear los resultados para extraer solo los datos necesarios
  //     return historiales.map(historial => ({
  //       fechaCreacion: historial.createdAt,
  //       valorPago: historial.valor,
  //       nombreCliente: historial.cliente.nombre
  //     }));
      
  //   } catch (error) {
  //     return {
  //       message: 'Error en el servidor',
  //       error: error
  //     };
  //   }
  // }

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
