import { Module } from '@nestjs/common';
import { AlquilerService } from './alquiler.service';
import { AlquilerController } from './alquiler.controller';

@Module({
  controllers: [AlquilerController],
  providers: [AlquilerService]
})
export class AlquilerModule {}
