import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialParqueoService } from './historial-parqueo.service';
import { CreateHistorialParqueoDto } from './dto/create-historial-parqueo.dto';
import { UpdateHistorialParqueoDto } from './dto/update-historial-parqueo.dto';

@Controller('historial-parqueo')
export class HistorialParqueoController {
  constructor(private readonly historialParqueoService: HistorialParqueoService) {}

  @Post()
  create(@Body() createHistorialParqueoDto: CreateHistorialParqueoDto) {
    return this.historialParqueoService.create(createHistorialParqueoDto);
  }

  @Get()
  findAll() {
    return this.historialParqueoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialParqueoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialParqueoDto: UpdateHistorialParqueoDto) {
    return this.historialParqueoService.update(+id, updateHistorialParqueoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialParqueoService.remove(+id);
  }
}
