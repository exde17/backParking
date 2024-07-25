import { Module } from '@nestjs/common';
import { HistorialParqueoService } from './historial-parqueo.service';
import { HistorialParqueoController } from './historial-parqueo.controller';

@Module({
  controllers: [HistorialParqueoController],
  providers: [HistorialParqueoService]
})
export class HistorialParqueoModule {}
