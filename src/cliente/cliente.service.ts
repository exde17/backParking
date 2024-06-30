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

        const pagoDiario = await this.pagoTotalRepository.findOne({
          where: { cliente: { id: item.id } }
        })
        console.log("item: ", item.id)
        console.log("diario: ", item.valor)

        const debe = await this.pagoParcialRepository.findOne({
          where: {
            cliente: { id: item.id }
          }
        })

        console.log("debr: ", debe)

        const sobra = await this.pagoMasRepository.findOne({
          where: {
            cliente: { id: item.id }
          }
        })

        if(sobra || debe){
          item.novedad = true;

          await this.clienteRepository.update(item.id, item)
        }else{
          item.novedad = false;

          await this.clienteRepository.update(item.id, item)
        }

        console.log("sobra: ", sobra)

        const opera = ((+(item?.valor ?? 0)) + (+(debe?.valor ?? 0))) - (+(sobra?.valor ?? 0));

        console.log("operacion: ", opera);
        inf = {
          "nombre": item.nombre,
          "valor": opera,
          "novedad": item.novedad
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

  // @Cron('0 0 * * *') // Se ejecuta todos los días a las 00:00
  // async resetearPagos() {
  //   //verifico si hay clientes que no han pagado al final del dia y guardo en pago parcial el valor de la deuda que es el valor del pago del cliente
  //   const cliente = await this.clienteRepository.find({ where: { pago: false } });
  //   cliente.forEach(async (cliente) => {
  //     const pagoParcial = this.pagoParcialRepository.create({
  //       cliente: cliente,
  //       valor: cliente.valor
  //     });
  //     await this.pagoParcialRepository.save(pagoParcial);
  //   });
  //   // Actualiza todos los clientes para que no tengan el pago realizado
  //   await this.clienteRepository.update({}, { pago: false });
  // }

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
      console.log('se ejecuto el cron')
      await this.pagoParcialRepository.save(pagoParcial);
    }
    // Actualiza todos los clientes para que no tengan el pago realizado
    await this.clienteRepository.update({}, { pago: false });
  }
}
