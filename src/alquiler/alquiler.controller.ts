import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AlquilerService } from './alquiler.service';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';

@Controller('alquiler')
export class AlquilerController {
  constructor(private readonly alquilerService: AlquilerService) {}

  @Post()
  async create(@Body() createAlquilerDto: CreateAlquilerDto) {
    return this.alquilerService.create(createAlquilerDto);
  }

  @Get()
  findAll() {
    return this.alquilerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.alquilerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateAlquilerDto: UpdateAlquilerDto) {
    return this.alquilerService.update(id, updateAlquilerDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.alquilerService.remove(id);
  }
}