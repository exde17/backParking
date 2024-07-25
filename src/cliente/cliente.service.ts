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

      // let data =[]
      const clientes = await this.clienteRepository.find()

      const data = await Promise.all(clientes.map(async (item) => {
        let inf = {}
        let opera = 0;
        
        const debe = await this.pagoParcialRepository.findOne({
          where: {
            cliente: { id: item.id }
          }
        })

        const sobra = await this.pagoMasRepository.findOne({
          where: {
            cliente: { id: item.id }
          }
        })

        // console.log("sobra: ", sobra)
        

        if(debe){
          item.novedad = true;

          await this.clienteRepository.update(item.id, item)
        }else{
          item.novedad = false;

          await this.clienteRepository.update(item.id, item)
        }

        //verifico si el cliente ya pago pero incompleto
        if(debe && item.pago){ // si esta incompleto debuelvo solo lo que debe sin el valor que paga diario
          opera = +debe?.valor ?? 0;
        }else{  //si no deb hago lo normal
          opera = ((+(item?.valor ?? 0)) + (+(debe?.valor ?? 0))) - (+(sobra?.valor ?? 0));
        } 
        
        inf = {
          "id": item.id,
          "nombre": item.nombre,
          "valor": opera,
          "novedad": item.novedad,
          "pago": item.pago,
          "isActive": item.isActive,
        };


        return inf;

      }))

      return data;
    } catch (error) {
      return {
        message: 'Error al obtener los clientes',
        error
      }

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
      const cliente = await this.clienteRepository.update(id, updateClienteDto)
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
    const clientes = await this.clienteRepository.find({ where: { pago: false } });
    for (const cliente of clientes) {
      const pagoParcial = this.pagoParcialRepository.create({
        cliente: cliente,
        valor: cliente.valor,
      });
      //console.log('se ejecuto el cron')
      await this.pagoParcialRepository.save(pagoParcial);
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
  }
}
