import { Module } from '@nestjs/common';
import { HistorialAlquilerService } from './historial-alquiler.service';
import { HistorialAlquilerController } from './historial-alquiler.controller';

@Module({
  controllers: [HistorialAlquilerController],
  providers: [HistorialAlquilerService]
})
export class HistorialAlquilerModule {}
