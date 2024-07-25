import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ParqueoService } from './parqueo.service';
import { CreateParqueoDto } from './dto/create-parqueo.dto';
import { UpdateParqueoDto } from './dto/update-parqueo.dto';

@Controller('parqueo')
export class ParqueoController {
  constructor(private readonly parqueoService: ParqueoService) {}

  @Post()
  async create(@Body() createParqueoDto: CreateParqueoDto) {
    return this.parqueoService.create(createParqueoDto);
  }

  @Get()
  async findAll() {
    return this.parqueoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parqueoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateParqueoDto: UpdateParqueoDto) {
    return this.parqueoService.update(id, updateParqueoDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.parqueoService.remove(id);
  }
}
