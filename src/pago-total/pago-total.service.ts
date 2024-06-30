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
    private dataSource: DataSource
  ){}
  

  async create(createPagoTotalDto: CreatePagoTotalDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const { cliente, ...create } = createPagoTotalDto;
      
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
      console.log(valorDebe)
      
      const valorTotal = ((+(valorDiario?.valor ?? 0)) + (+(valorDebe?.valor ?? 0)) - (+(valorMas?.valor ?? 0)));
      console.log('valordiario: ', valorDiario?.valor,'--','valordebe: ',valorDebe?.valor,'--','valormas: ',valorMas?.valor)
  
      let pago;
      console.log('pago: ',valorTotal)
      //si paga todo se va por aqui
      if (createPagoTotalDto.valor === valorTotal) {
        pago = this.pagoTotalRepository.create({
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
          
        } else {
          
          pago = this.pagoParcialRepository.create(
            {
              // id: masdebe.id,
              valor: resultado,
              cliente: { id: cliente }
            }
          )
        }

        if(valorMas){
          await queryRunner.manager.delete(PagoMa, {
            cliente: { id: cliente }
          })
        }
        
      } else {
        const resultado = createPagoTotalDto.valor - valorTotal;
        pago = this.pagoMaRepository.create({
          valor: resultado,
          cliente: { id: cliente }
        });

        if(valorDebe){
          await queryRunner.manager.delete(PagoParcial, {
            cliente: { id: cliente }
          })
        }
      }
  
      await queryRunner.manager.save(pago);
  
      valorDiario.novedad = createPagoTotalDto.valor !== valorTotal;
      valorDiario.novedad = createPagoTotalDto.valor == valorTotal;
      valorDiario.pago = true;
      await queryRunner.manager.save(valorDiario);
  
      await queryRunner.commitTransaction();
  
      return {
        message: 'Pago creado con éxito',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error)
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

