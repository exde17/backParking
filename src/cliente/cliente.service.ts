import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>
  ){}
  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create(createClienteDto)

      await this.clienteRepository.save(cliente)
      return{
        message: 'Cliente creado con exito',
        // cliente
      }
    } catch (error) {
      return{
        message: 'Error al crear el cliente',
        error
      }
      
    }
  }

  async findAll() {
    try {
      return await this.clienteRepository.find()
    } catch (error) {
      return{
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
      return{
        message: 'Cliente actualizado con exito',
        // cliente
      }
    } catch (error) {
      return{
        message: 'Error al actualizar el cliente',
        error
      }
      
    }
  }

  async remove(id: string) {
    try {
      await this.clienteRepository.delete(id)
      return{
        message: 'Cliente eliminado con exito'
      }
    } catch (error) {
      return{
        message: 'Error al eliminar el cliente',
        error
      }
      
    }
  }
}
