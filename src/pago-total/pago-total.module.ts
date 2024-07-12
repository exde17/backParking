import { Module } from '@nestjs/common';
import { PagoTotalService } from './pago-total.service';
import { PagoTotalController } from './pago-total.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoTotal } from './entities/pago-total.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { PagoParcial } from 'src/pago-parcial/entities/pago-parcial.entity';
import { PagoMa } from 'src/pago-mas/entities/pago-ma.entity';
import { Historial } from 'src/historial/entities/historial.entity';

@Module({
  controllers: [PagoTotalController],
  providers: [PagoTotalService],
  imports: [TypeOrmModule.forFeature([PagoTotal, Cliente, PagoParcial, PagoMa, Historial])]
})
export class PagoTotalModule {}
