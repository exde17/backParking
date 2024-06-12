import { Module } from '@nestjs/common';
import { PagoTotalService } from './pago-total.service';
import { PagoTotalController } from './pago-total.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoTotal } from './entities/pago-total.entity';

@Module({
  controllers: [PagoTotalController],
  providers: [PagoTotalService],
  imports: [TypeOrmModule.forFeature([PagoTotal])]
})
export class PagoTotalModule {}
