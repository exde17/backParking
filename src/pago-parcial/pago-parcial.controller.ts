import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PagoParcialService } from './pago-parcial.service';
import { CreatePagoParcialDto } from './dto/create-pago-parcial.dto';
import { UpdatePagoParcialDto } from './dto/update-pago-parcial.dto';

@Controller('pago-parcial')
export class PagoParcialController {
  constructor(private readonly pagoParcialService: PagoParcialService) {}

  @Post()
  async create(@Body() createPagoParcialDto: CreatePagoParcialDto) {
    return this.pagoParcialService.create(createPagoParcialDto);
  }

  @Get()
  async findAll() {
    return this.pagoParcialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.pagoParcialService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePagoParcialDto: UpdatePagoParcialDto) {
    return this.pagoParcialService.update(id, updatePagoParcialDto);
  }

  @Delete(':id')
  async remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.pagoParcialService.remove(id);
  }
}
