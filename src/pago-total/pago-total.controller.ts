import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PagoTotalService } from './pago-total.service';
import { CreatePagoTotalDto } from './dto/create-pago-total.dto';
import { UpdatePagoTotalDto } from './dto/update-pago-total.dto';
import { Auth } from 'src/user/decorator';
import { ValidRoles } from 'src/user/interfaces';

@Controller('pago-total')
export class PagoTotalController {
  constructor(private readonly pagoTotalService: PagoTotalService) {}

  //suma de pagos totales
  @Get('sumaPagos')
  @Auth(ValidRoles.admin)
  async sumaTotal(){
    return this.pagoTotalService.sumaTotal();
  }
  
  @Post()
  @Auth(ValidRoles.admin)
  async create(@Body() createPagoTotalDto: CreatePagoTotalDto) {
    return this.pagoTotalService.create(createPagoTotalDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  async findAll() {
    return this.pagoTotalService.findAll();
  }

  //get que trae los valores de si pago, cuanto debe que esta en pago parcial y cuanto mas debe que esta en pago ma
  @Get('valores/:id')
  @Auth(ValidRoles.admin)
  async findValores(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagoTotalService.findValores(id);
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagoTotalService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  async update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePagoTotalDto: UpdatePagoTotalDto) {
    return this.pagoTotalService.update(id, updatePagoTotalDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.pagoTotalService.remove(id);
  }
}
