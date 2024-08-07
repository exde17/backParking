import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PagoParcial } from 'src/pago-parcial/entities/pago-parcial.entity';
import { PagoTotal } from 'src/pago-total/entities/pago-total.entity';
import { PagoMa } from 'src/pago-mas/entities/pago-ma.entity';
import { Historial } from 'src/historial/entities/historial.entity';
import { Alquiler } from 'src/alquiler/entities/alquiler.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(PagoParcial)
    private readonly pagoParcialRepository: Repository<PagoParcial>,
    @InjectRepository(PagoTotal)
    private readonly pagoTotalRepository: Repository<PagoTotal>,
    @InjectRepository(PagoMa)
    private readonly pagoMasRepository: Repository<PagoMa>,
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
    @InjectRepository(Alquiler)
    private readonly alquilerRepository: Repository<Alquiler>,
  ) { }
  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create(createClienteDto)

      await this.clienteRepository.save(cliente)
      return {
        message: 'Cliente creado con exito',
        // cliente
      }
    } catch (error) {
      return {
        message: 'Error al crear el cliente',
        error
      }

    }
  }

  async findAll() {
    try {
  
      // Obtener los clientes ordenados por nombre
      const clientes = await this.clienteRepository.find({
        order: {
          nombre: 'ASC', // Asegurar la ordenación por nombre ascendente
        },
      });
  
  
      const data = await Promise.all(clientes.map(async (item) => {
        let opera = 0;
  
        const debe = await this.pagoParcialRepository.findOne({
          where: {
            cliente: { id: item.id },
          },
        });
  
        const sobra = await this.pagoMasRepository.findOne({
          where: {
            cliente: { id: item.id },
          },
        });
  
        // Actualizar el estado de novedad del cliente
        item.novedad = !!debe;
        await this.clienteRepository.update(item.id, item);
  
        // Verificar si el cliente ya pagó pero incompleto
        if (debe && item.pago) {
          // Si está incompleto devuelvo solo lo que debe sin el valor que paga diario
          opera = +debe?.valor ?? 0;
        } else {
          // Si no debe, hago lo normal
          opera = ((+(item?.valor ?? 0)) + (+(debe?.valor ?? 0))) - (+(sobra?.valor ?? 0));
        }
  
        const inf = {
          id: item.id,
          nombre: item.nombre,
          valor: opera,
          novedad: item.novedad,
          pago: item.pago,
          isActive: item.isActive,
          pagoMensual: item.pagoMensual,
        };
  
        return inf;
      }));
  
      // Ordenar nuevamente los datos finales para asegurar que están ordenados
      const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      //console.log("Datos finales ordenados:", sortedData);
  
      return sortedData;
    } catch (error) {
     
      return {
        message: 'Error al obtener los clientes',
        error,
      };
    }
  }
  
  //traigo todos los clientes mensuales
  async findAllMensuales() {
    try {
      // Obtener los clientes ordenados por nombre
      const clientes = await this.clienteRepository.find({
        where: { pagoMensual: true },
        order: {
          nombre: 'ASC', // Asegurar la ordenación por nombre ascendente
        },
      });
  
      const data = await Promise.all(clientes.map(async (item) => {
        let opera = 0;
  
        const debe = await this.pagoParcialRepository.findOne({
          where: {
            cliente: { id: item.id },
          },
        });
  
        const sobra = await this.pagoMasRepository.findOne({
          where: {
            cliente: { id: item.id },
          },
        });
  
        // Actualizar el estado de novedad del cliente
        item.novedad = !!debe;
        await this.clienteRepository.update(item.id, item);
  
        // Verificar si el cliente ya pagó pero incompleto
        if (debe && item.pago) {
          // Si está incompleto devuelvo solo lo que debe sin el valor que paga diario
          opera = +debe?.valor ?? 0;
        } else {
          // Si no debe, hago lo normal
          opera = ((+(item?.valor ?? 0)) + (+(debe?.valor ?? 0))) - (+(sobra?.valor ?? 0));
        }
  
        const inf = {
          id: item.id,
          nombre: item.nombre,
          valor: opera,
          novedad: item.novedad,
          pago: item.pago,
          isActive: item.isActive,
        };
  
        return inf;
      }));
  
      // Ordenar nuevamente los datos finales para asegurar que están ordenados
      const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      //console.log("Datos finales ordenados:", sortedData);
  
      return sortedData;
    } catch (error) {
      return {
        message: 'Error al obtener los clientes mensuales',
        error,
      };
    }
  }

  async findOne(id: string) {
    try {
      return await this.clienteRepository.findOne({
        where: {
          id
        }

      })
    } catch (error) {

    }
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    try {
      await this.clienteRepository.update(id, updateClienteDto)
      return {
        message: 'Cliente actualizado con exito',
        // cliente
      }
    } catch (error) {
      return {
        message: 'Error al actualizar el cliente',
        error
      }

    }
  }

  async remove(id: string) {
    try {
      await this.clienteRepository.delete(id)
      return {
        message: 'Cliente eliminado con exito'
      }
    } catch (error) {
      return {
        message: 'Error al eliminar el cliente',
        error
      }

    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'America/Bogota',
  })
  async resetearPagos() {
    // Verifico si hay clientes que no han pagado al final del día y guardo en pago parcial el valor de la deuda que es el valor del pago del cliente
    const clientes = await this.clienteRepository.find({ where: { 
      pago: false,
      pagoMensual: false
     } });
    for (const cliente of clientes) {
      //verifico si ya existe un registro de este cliente en pago parcial y si existe lo actualizo con la suma del valor que ya tiene mas el valor que debe
      const pagoParcialExistente = await this.pagoParcialRepository.findOne({
        where: { cliente: { id: cliente.id } },
      });
      if (pagoParcialExistente) {
        pagoParcialExistente.valor =(+ pagoParcialExistente.valor)+ (+ cliente.valor);
        await this.pagoParcialRepository.save(pagoParcialExistente);
        continue;
      }
      else{
        const pagoParcial = this.pagoParcialRepository.create({
          cliente: cliente,
          valor: cliente.valor,
        });
        //console.log('se ejecuto el cron')
        await this.pagoParcialRepository.save(pagoParcial);
      }
      }
      
    // Actualiza todos los clientes para que no tengan el pago realizado
    await this.clienteRepository.update({}, { pago: false });

    //verifico si hay alguno que tenga en pago mas y comparao si el valor a pagar es menor o igual al valor que tiene en pago mas y automaticamento lo resto de pago mas y lo pongo en pago total y habilito el pago en true
    const pagosMas = await this.pagoMasRepository.find({
      relations: ['cliente'],
    });
    for (const pagoMas of pagosMas) {
      const cliente = await this.clienteRepository.findOne({
        where: {id: pagoMas.cliente.id} 
      });
      if (cliente.valor < pagoMas.valor) {
        const pagoTotal = this.pagoTotalRepository.create({
          cliente: cliente,
          valor: cliente.valor 
        });
        await this.pagoTotalRepository.save(pagoTotal);
        cliente.pago = true;
        await this.clienteRepository.save(cliente);

        //guardo en historial
        const historial = this.historialRepository.create({
          valor: cliente.valor,
          cliente: cliente
        });
        await this.historialRepository.save(historial);
        //calculo lo que sobro en pago mas y actualizo el valor
        pagoMas.valor = pagoMas.valor - cliente.valor;
        await this.pagoMasRepository.save(pagoMas);
        // await this.pagoMasRepository.delete(pagoMas.id);
      }

      //si el valor de lo que paga es igual se va por aca
      else if (cliente.valor === pagoMas.valor) {
        const pagoTotal = this.pagoTotalRepository.create({
          cliente: cliente,
          valor: cliente.valor 
        });
        await this.pagoTotalRepository.save(pagoTotal);
        cliente.pago = true;
        await this.clienteRepository.save(cliente);
        await this.pagoMasRepository.delete(pagoMas.id);

        //guardo en historial
        const historial = this.historialRepository.create({
          valor: cliente.valor,
          cliente: cliente
        });
        await this.historialRepository.save(historial);
      }
    }

    //si el pending es true y el isPause es false de algun registro de alquiler el precio se aumenta al doble
    const alquiler = await this.alquilerRepository.find({
      where: { 
        pending: true,
       }
    });

    for (const item of alquiler) {
      item.precio = (+ item.precio) + 5000;
      await this.alquilerRepository.save(item);
    }

    //pongo todos los isActive que esten en false en true en la tabla alquiler

    const alquileres = await this.alquilerRepository.find({
      where: { isActive: false }
    });

    for (const item of alquileres) {
      item.isActive = true;
      await this.alquilerRepository.save(item);
    }

  }
}
