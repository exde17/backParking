import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ClienteModule } from './cliente/cliente.module';
import { PagoParcialModule } from './pago-parcial/pago-parcial.module';
import { PagoTotalModule } from './pago-total/pago-total.module';
import { PagoMasModule } from './pago-mas/pago-mas.module';
import { HistorialModule } from './historial/historial.module';
import { ParqueoModule } from './parqueo/parqueo.module';
import { HistorialParqueoModule } from './historial-parqueo/historial-parqueo.module';
import { AlquilerModule } from './alquiler/alquiler.module';
import { HistorialAlquilerModule } from './historial-alquiler/historial-alquiler.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      // ssl: process.env.STAGE === 'prod',
      // extra: {
      //   ssl:
      //     process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      // },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: `${process.env.DB_PASSWORD}`,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    ClienteModule,
    PagoParcialModule,
    PagoTotalModule,
    PagoMasModule,
    HistorialModule,
    ParqueoModule,
    HistorialParqueoModule,
    AlquilerModule,
    HistorialAlquilerModule,
  ],
})
export class AppModule {}
