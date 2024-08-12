import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AlquilerService } from './alquiler.service';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';
import { Auth } from 'src/user/decorator';
import { ValidRoles } from 'src/user/interfaces';

@Controller('alquiler')
export class AlquilerController {
  constructor(private readonly alquilerService: AlquilerService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(@Body() createAlquilerDto: CreateAlquilerDto) {
    return this.alquilerService.create(createAlquilerDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.alquilerService.findAll();
  }

  //actualizar el estado de pendiente
  @Patch('pendiente/:id')
  @Auth(ValidRoles.admin)
  updatePendiente(@Param('id',ParseUUIDPipe) id: string) {
    return this.alquilerService.updatePendiente(id);
  }

  //actualizar el estado de ispaused
  @Patch('ispaused/:id')
  @Auth(ValidRoles.admin)
  updateIsPaused(@Param('id',ParseUUIDPipe) id: string) {
    return this.alquilerService.updateIsPaused(id);
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.alquilerService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateAlquilerDto: UpdateAlquilerDto) {
    return this.alquilerService.update(id, updateAlquilerDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.alquilerService.remove(id);
  }
}
