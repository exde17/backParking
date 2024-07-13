import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Auth } from 'src/user/decorator';
import { ValidRoles } from 'src/user/interfaces';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async reate(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  async findAll() {
    return this.clienteService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clienteService.remove(id);
  }
}
