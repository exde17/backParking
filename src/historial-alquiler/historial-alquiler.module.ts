import { Module } from '@nestjs/common';
import { HistorialAlquilerService } from './historial-alquiler.service';
import { HistorialAlquilerController } from './historial-alquiler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAlquiler } from './entities/historial-alquiler.entity';
import { Alquiler } from 'src/alquiler/entities/alquiler.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [HistorialAlquilerController],
  providers: [HistorialAlquilerService],
  imports: [TypeOrmModule.forFeature([HistorialAlquiler, Alquiler]), UserModule],
})
export class HistorialAlquilerModule {}
