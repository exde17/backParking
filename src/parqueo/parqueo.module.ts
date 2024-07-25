import { Module } from '@nestjs/common';
import { ParqueoService } from './parqueo.service';
import { ParqueoController } from './parqueo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parqueo } from './entities/parqueo.entity';

@Module({
  controllers: [ParqueoController],
  providers: [ParqueoService],
  imports: [TypeOrmModule.forFeature([Parqueo])]
})
export class ParqueoModule {}
