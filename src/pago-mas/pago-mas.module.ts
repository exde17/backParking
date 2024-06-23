import { Module } from '@nestjs/common';
import { PagoMasService } from './pago-mas.service';
import { PagoMasController } from './pago-mas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoMa } from './entities/pago-ma.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Module({
  controllers: [PagoMasController],
  providers: [PagoMasService],
  imports: [TypeOrmModule.forFeature([PagoMa, Cliente])]
})
export class PagoMasModule {}
