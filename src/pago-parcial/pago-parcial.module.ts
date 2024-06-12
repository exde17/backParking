import { Module } from '@nestjs/common';
import { PagoParcialService } from './pago-parcial.service';
import { PagoParcialController } from './pago-parcial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoParcial } from './entities/pago-parcial.entity';

@Module({
  controllers: [PagoParcialController],
  providers: [PagoParcialService],
  imports: [TypeOrmModule.forFeature([PagoParcial])]
})
export class PagoParcialModule {}
