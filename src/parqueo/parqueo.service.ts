import { Injectable } from '@nestjs/common';
import { CreateParqueoDto } from './dto/create-parqueo.dto';
import { UpdateParqueoDto } from './dto/update-parqueo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parqueo } from './entities/parqueo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParqueoService {

  constructor(
    @InjectRepository(Parqueo)
    private readonly parqueoRepository: Repository<Parqueo>,
  ) {}
  async create(createParqueoDto: CreateParqueoDto) {
    try {
      const parqueo = this.parqueoRepository.create(createParqueoDto);
      await this.parqueoRepository.save(parqueo);
      return {
        message: 'Parqueo creado exitosamente',
        // parqueo
      
      }
    }
    catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      return await this.parqueoRepository.find();
    } catch (error) {
      return error;
      
    }
  }

  async findOne(id: string) {
    try {
      return await this.parqueoRepository.findOne({
        where: {
          id
        }
      
      });
    } catch (error) {
      return error;
      
    }
    
  }

  async update(id: string, updateParqueoDto: UpdateParqueoDto) {
    try {
      await this.parqueoRepository.update(id, updateParqueoDto);
      return {
        message: 'Parqueo actualizado exitosamente'
      }
    } catch (error) {
      return error;
      
    }
    
  }

  async remove(id: string) {
    try {
      await this.parqueoRepository.delete(id);
      return {
        message: 'Parqueo eliminado exitosamente'
      }
    } catch (error) {
      return error;
    
  }
}}
