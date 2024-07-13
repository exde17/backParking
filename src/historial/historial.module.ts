import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historial } from './entities/historial.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [HistorialController],
  providers: [HistorialService],
  imports: [TypeOrmModule.forFeature([Historial]), UserModule]
})
export class HistorialModule {}
