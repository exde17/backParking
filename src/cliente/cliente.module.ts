import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { PagoParcial } from 'src/pago-parcial/entities/pago-parcial.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { PagoMa } from 'src/pago-mas/entities/pago-ma.entity';
import { PagoTotal } from 'src/pago-total/entities/pago-total.entity';
import { Historial } from 'src/historial/entities/historial.entity';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
  imports: [TypeOrmModule.forFeature([Cliente, PagoParcial, PagoMa, PagoTotal,Historial]),ScheduleModule.forRoot(),]
})
export class ClienteModule {}
