import { Module } from '@nestjs/common';
import { AlquilerService } from './alquiler.service';
import { AlquilerController } from './alquiler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alquiler } from './entities/alquiler.entity';
import { HistorialAlquiler } from 'src/historial-alquiler/entities/historial-alquiler.entity';

@Module({
  controllers: [AlquilerController],
  providers: [AlquilerService],
  imports: [TypeOrmModule.forFeature([Alquiler, HistorialAlquiler])]
})
export class AlquilerModule {}
