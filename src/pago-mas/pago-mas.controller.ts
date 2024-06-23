import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PagoMasService } from './pago-mas.service';
import { CreatePagoMaDto } from './dto/create-pago-ma.dto';
import { UpdatePagoMaDto } from './dto/update-pago-ma.dto';

@Controller('pago-mas')
export class PagoMasController {
  constructor(private readonly pagoMasService: PagoMasService) {}

  @Post()
  async create(@Body() createPagoMaDto: CreatePagoMaDto) {
    return this.pagoMasService.create(createPagoMaDto);
  }

  @Get()
  async findAll() {
    return this.pagoMasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.pagoMasService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePagoMaDto: UpdatePagoMaDto) {
    return this.pagoMasService.update(id, updatePagoMaDto);
  }

  @Delete(':id')
  async remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.pagoMasService.remove(id);
  }
}
