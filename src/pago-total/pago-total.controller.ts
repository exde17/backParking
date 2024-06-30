import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PagoTotalService } from './pago-total.service';
import { CreatePagoTotalDto } from './dto/create-pago-total.dto';
import { UpdatePagoTotalDto } from './dto/update-pago-total.dto';

@Controller('pago-total')
export class PagoTotalController {
  constructor(private readonly pagoTotalService: PagoTotalService) {}

  @Post()
  async create(@Body() createPagoTotalDto: CreatePagoTotalDto) {
    return this.pagoTotalService.create(createPagoTotalDto);
  }

  @Get()
  async findAll() {
    return this.pagoTotalService.findAll();
  }

  //get que trae los valores de si pago, cuanto debe que esta en pago parcial y cuanto mas debe que esta en pago ma
  @Get('valores/:id')
  async findValores(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagoTotalService.findValores(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagoTotalService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePagoTotalDto: UpdatePagoTotalDto) {
    return this.pagoTotalService.update(id, updatePagoTotalDto);
  }

  @Delete(':id')
  async remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.pagoTotalService.remove(id);
  }
}
