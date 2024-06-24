import { Injectable } from '@nestjs/common';
import { CreatePagoTotalDto } from './dto/create-pago-total.dto';
import { UpdatePagoTotalDto } from './dto/update-pago-total.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoTotal } from './entities/pago-total.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { equals } from 'class-validator';
import { PagoParcial } from 'src/pago-parcial/entities/pago-parcial.entity';
import { PagoMa } from 'src/pago-mas/entities/pago-ma.entity';

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
    private readonly pagoMaRepository: Repository <PagoMa>
  ){}
  async create(createPagoTotalDto: CreatePagoTotalDto) {
    try {
      
      // consulto el valor que debe pagar el cliente
      const { cliente, ...create } = createPagoTotalDto
      console.log('id del dto: ',cliente)
      const valor = await this.clienteRepository.findOne({
        where: {id: cliente},
        // select: ['valor']
      })

      console.log(valor.id)

      //comparo los valores para decidir donde va a guardar el pago
      if (createPagoTotalDto.valor === valor.valor) {
        console.log('guardo en total')
        const pago = this.pagoTotalRepository.create({
          valor: createPagoTotalDto.valor,
          cliente: { id: cliente }
        })

        await this.pagoTotalRepository.save(pago)

        valor.novedad= false;
        await this.clienteRepository.save(valor);
        valor.pago= true;
        await this.clienteRepository.save(valor);

        return{
          message: 'Pago creado con exito',
          // pago
        }
      }else if (createPagoTotalDto.valor < valor.valor) {
        
        //calculo el valor restante
        const resultado = valor.valor - createPagoTotalDto.valor
        //asigno el nuevo valor 
        createPagoTotalDto.valor = resultado
        console.log('guardo en parcial: ', resultado)
        //creo el pago parcial
        const pago = this.pagoParcialRepository.create({
          valor: createPagoTotalDto.valor,
          cliente: { id: cliente }
        })

        await this.pagoParcialRepository.save(pago)

        valor.novedad= true;
        await this.clienteRepository.save(valor);
        valor.pago= true;
        await this.clienteRepository.save(valor);
        return{
          message: 'Pago creado con exito',
          // pago
        }
      }else if (createPagoTotalDto.valor > valor.valor) {
        
        //calculo el valor restante
        const resultado = createPagoTotalDto.valor - valor.valor
        //asigno el nuevo valor
        createPagoTotalDto.valor = resultado
        console.log('guardo en mas: ', resultado)
        //creo el pago mas
        const pago = this.pagoMaRepository.create({
          valor: createPagoTotalDto.valor,
          cliente: { id: cliente }
        })

        await this.pagoMaRepository.save(pago)

        valor.novedad= true;
        await this.clienteRepository.save(valor);
        valor.pago= true;
        await this.clienteRepository.save(valor);
        return{
          message: 'Pago creado con exito',
          // pago
        }
      }

      // const pago = this.pagoTotalRepository.create(createPagoTotalDto)
      // await this.pagoTotalRepository.save(pago)

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
}
function elseif(arg0: boolean) {
  throw new Error('Function not implemented.');
}

