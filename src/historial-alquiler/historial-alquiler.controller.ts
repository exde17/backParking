import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialAlquilerService } from './historial-alquiler.service';
import { CreateHistorialAlquilerDto } from './dto/create-historial-alquiler.dto';
import { UpdateHistorialAlquilerDto } from './dto/update-historial-alquiler.dto';

@Controller('historial-alquiler')
export class HistorialAlquilerController {
  constructor(private readonly historialAlquilerService: HistorialAlquilerService) {}

  @Post()
  async create(@Body() createHistorialAlquilerDto: CreateHistorialAlquilerDto) {
    return this.historialAlquilerService.create(createHistorialAlquilerDto);
  }

  @Get()
  findAll() {
    return this.historialAlquilerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialAlquilerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialAlquilerDto: UpdateHistorialAlquilerDto) {
    return this.historialAlquilerService.update(+id, updateHistorialAlquilerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialAlquilerService.remove(+id);
  }
}
