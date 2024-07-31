import { Injectable } from '@nestjs/common';
import { CreatePagoTotalDto } from './dto/create-pago-total.dto';
import { UpdatePagoTotalDto } from './dto/update-pago-total.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoTotal } from './entities/pago-total.entity';
import { Repository, getConnection, getManager } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { equals } from 'class-validator';
import { PagoParcial } from 'src/pago-parcial/entities/pago-parcial.entity';
import { PagoMa } from 'src/pago-mas/entities/pago-ma.entity';
import { DataSource } from 'typeorm';
import { Historial } from 'src/historial/entities/historial.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class PagoTotalService {
  constructor(
    @InjectRepository(PagoTotal)
    private readonly pagoTotalRepository: Repository <PagoTotal>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository <Cliente>,
    @InjectRepository(PagoParcial)
    private readonly pagoParcialRepository: Repository <PagoParcial>,
    @InjectRepository(PagoMa)
    private readonly pagoMaRepository: Repository <PagoMa>,
    @InjectRepository(Historial)
    private readonly historialRepository: Repository <Historial>,
    private dataSource: DataSource
  ){}
  

  async create(createPagoTotalDto: CreatePagoTotalDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const { cliente, ...create } = createPagoTotalDto;
      let valorTotal
      
      // Asumiendo que tienes una entidad llamada Cliente y otra llamada PagoParcial y PagoMa
      const valorDiario = await queryRunner.manager.findOne(Cliente, {
        where: {id: cliente},
      });
  
      const valorDebe = await queryRunner.manager.findOne(PagoParcial, {
        where: {cliente:{id: cliente}}
      });
  
      const valorMas = await queryRunner.manager.findOne(PagoMa, {
        where: {cliente:{id: cliente}}
      });
      // console.log(valorDebe)

      //verifico si ya pago y debe pero quiere pagar lo que debe el mismo dia
      if(valorDebe && valorDiario?.pago){
        valorTotal = valorDebe.valor
      }else{
        valorTotal = ((+(valorDiario?.valor ?? 0)) + (+(valorDebe?.valor ?? 0)) - (+(valorMas?.valor ?? 0)));
      }
      
      
      //console.log('valordiario: ', valorDiario?.valor,'--','valordebe: ',valorDebe?.valor,'--','valormas: ',valorMas?.valor)
  
      let pago;
      let historial;
      //console.log('pago: ',valorTotal)
      //si paga todo se va por aqui
      if (createPagoTotalDto.valor === valorTotal) {
        pago = this.pagoTotalRepository.create({
          valor: createPagoTotalDto.valor,
          cliente: { id: cliente }
        });

        //guardo en historial para que este un registro de los pagos
        historial = this.historialRepository.create({
          valor: createPagoTotalDto.valor,
          cliente: { id: cliente }
        });

        //elimino algun registro que exista tanto en debe como en sobra plaqta
        if(valorDebe){
          await queryRunner.manager.delete(PagoParcial, {
            cliente: { id: cliente }
          })
        }
        if(valorMas){
          await queryRunner.manager.delete(PagoMa, {
            cliente: { id: cliente }
          })
        }

        //pongo en true el pago para que no se pueda volver a pagar
        //valorDiario.pago = true;


      } else if (createPagoTotalDto.valor < valorTotal)  { //si el pago es menor se viene por aca y actualiza la la tabla que debe
        const resultado = valorTotal - createPagoTotalDto.valor;
        //consulto el valor que se devia antes
        const masdebe = await queryRunner.manager.findOne(PagoParcial,{
          where: {cliente:{id: cliente}} 
        })
        
        if(masdebe){
          pago = this.pagoParcialRepository.create(
            {
              id: masdebe.id,
              valor: resultado
            }
          )

          //guardo en historial para que este un registro de los pagos
          historial = this.historialRepository.create({
            valor: createPagoTotalDto.valor,
            cliente: { id: cliente }
          });
          
        } else {
          
          pago = this.pagoParcialRepository.create(
            {
              // id: masdebe.id,
              valor: resultado,
              cliente: { id: cliente }
            }
          )
          //guardo en historial para que este un registro de los pagos
          historial = this.historialRepository.create({
            valor: createPagoTotalDto.valor,
            cliente: { id: cliente }
          });
        }

        if(valorMas){
          await queryRunner.manager.delete(PagoMa, {
            cliente: { id: cliente }
          })
        }
        
      } else { //si el valor que paga es mayor a lo que debe se va por aca
        // console.log('valor total: ', valorTotal)
        // console.log('valor que paga: ', createPagoTotalDto.valor)
        const resultado = createPagoTotalDto.valor - valorTotal;

        // console.log('resultado: ', resultado)
        //verifico si existe un registro en la tabla de sobra plata para actualizarlo
        const masdebe = await queryRunner.manager.findOne(PagoMa,{
          where: {cliente:{id: cliente}} 
        })

        if(masdebe){
          pago = this.pagoMaRepository.create(
            {
              id: masdebe.id,
              valor: resultado //+ (+ masdebe.valor)
            }
          )
        } else {

        pago = this.pagoMaRepository.create({
          valor: resultado,
          cliente: { id: cliente }
        
        });
      }

        //guardo en historial para que este un registro de los pagos
        historial = this.historialRepository.create({
          valor: createPagoTotalDto.valor,
          cliente: { id: cliente }
        });

        if(valorDebe){
          await queryRunner.manager.delete(PagoParcial, {
            cliente: { id: cliente }
          })
        }
      }
  
      //valorDiario.pago = true;
      const elPago = this.clienteRepository.create({
        pago: true,
        id: cliente 
      });
      
      await queryRunner.manager.save(pago);
      await queryRunner.manager.save(historial);
  
      // valorDiario.novedad = createPagoTotalDto.valor !== valorTotal;
      // valorDiario.novedad = createPagoTotalDto.valor == valorTotal;
      
      await queryRunner.manager.save(elPago);
  
      await queryRunner.commitTransaction();
  
      return {
        message: 'Pago creado con éxito',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // console.log(error)
      return {
        message: 'Error en la creación del pago',
        error
      };
    } finally {
      await queryRunner.release();
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

  // suma de pagos totales del día actual
// async sumaTotal() {
//   // const moment = require('moment-timezone');
//   let suma = 0;
//   try {
//     const pagosTotales = await this.historialRepository.find();
    
//     console.log('pagos totales: ',pagosTotales)
    

//     // Obtener la fecha y hora actual en la zona horaria de Colombia
//     const fechaActual = moment().tz('America/Bogota').format('YYYY-MM-DD');
//     console.log('fecha actual: ',fechaActual)

//     const pagosDelDia = pagosTotales.filter((item) => {
//       const fechaPago = moment(item.createdAt).tz('America/Bogota').format('YYYY-MM-DD');
//       return fechaPago === fechaActual;
//     });
    
//     console.log('pagos del dia: ',pagosDelDia)

//     pagosDelDia.forEach((item) => {
//       suma += +item.valor;
//     });

//     return {
//       'totalPagos': suma.toLocaleString('es-ES')
//     };
//   } catch (error) {
//     return error;
//   }
// }

async sumaTotal() {
  let suma = 0;
  try {
    const pagosTotales = await this.historialRepository.find();
    // console.log('Pagos totales: ', pagosTotales);

    // Obtener la fecha y hora actual en la zona horaria de Colombia
    const fechaActual = moment().tz('America/Bogota').format('YYYY-MM-DD');

    const pagosDelDia = pagosTotales.filter((item) => {
      const fechaPago = moment(item.createdAt).tz('America/Bogota').format('YYYY-MM-DD');
      return fechaPago === fechaActual;
    });
  
      pagosDelDia.forEach((item) => {
        suma = (+ suma)+(+ item.valor);
      });

    

    pagosDelDia.forEach((item) => {
      suma += +item.valor;
    });
    console.log('numero: ', pagosDelDia.length);
    console.log('Pagos del día: ', suma);

    return {
      'totalPagos': suma.toLocaleString('es-ES')
    };
  } catch (error) {
    console.error('Error: ', error);
    return { error: error.message };
  }
}

  async findOne(id: string) {
    try {
      return await this.pagoTotalRepository.findOne({
        where: {id},
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
        message: 'Error en la obtencion de pago',
        error
      }
      
    }
  }

  async update(id: string, updatePagoTotalDto: UpdatePagoTotalDto) {
    try {
      const { cliente, ...update } = updatePagoTotalDto
      await this.pagoTotalRepository.update(id, {
        ...update,
        cliente: { id: cliente }
      
      })
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

  async findValores(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Cambia this.queryRunner.manager.findOne a queryRunner.manager.findOne
      const pago = await queryRunner.manager.findOne(Cliente, {
        where: {id},
      });

      const valorDebe = await queryRunner.manager.findOne(PagoParcial, {
        where: {cliente:{id}}
      });

      const valorMas = await queryRunner.manager.findOne(PagoMa, {
        where: {cliente:{id}}
      });

      await queryRunner.commitTransaction();

      return {
        pago: pago.pago,
        debe: valorDebe?.valor?? 0,
        adelantado: valorMas?.valor?? 0
      }
    } catch (error) {
      return{
        message: 'Error en la obtencion de valores',
        error
      }
    }
  }
}
// function elseif(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }

