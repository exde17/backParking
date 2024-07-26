import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { HistorialAlquilerService } from './historial-alquiler.service';
import { CreateHistorialAlquilerDto } from './dto/create-historial-alquiler.dto';
import { UpdateHistorialAlquilerDto } from './dto/update-historial-alquiler.dto';
import { Auth } from 'src/user/decorator';
import { ValidRoles } from 'src/user/interfaces';

@Controller('historial-alquiler')
export class HistorialAlquilerController {
  constructor(private readonly historialAlquilerService: HistorialAlquilerService) {}

  @Get("historyAlquiler/:id")
  @Auth(ValidRoles.admin)
  async create(@Param('id',ParseUUIDPipe) id: string) {
    return this.historialAlquilerService.create(id);
  }

  @Get()
  @Auth(ValidRoles.admin)
  async findAll() {
    return this.historialAlquilerService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.historialAlquilerService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateHistorialAlquilerDto: UpdateHistorialAlquilerDto) {
    return this.historialAlquilerService.update(+id, updateHistorialAlquilerDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.historialAlquilerService.remove(+id);
  }
}
