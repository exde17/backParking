import { Module } from '@nestjs/common';
import { HistorialAlquilerService } from './historial-alquiler.service';
import { HistorialAlquilerController } from './historial-alquiler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAlquiler } from './entities/historial-alquiler.entity';
import { Alquiler } from 'src/alquiler/entities/alquiler.entity';

@Module({
  controllers: [HistorialAlquilerController],
  providers: [HistorialAlquilerService],
  imports: [TypeOrmModule.forFeature([HistorialAlquiler, Alquiler])],
})
export class HistorialAlquilerModule {}
