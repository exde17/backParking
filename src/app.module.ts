import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
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
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      // validationSchema: Joi.object({
      //   JWT_SECRET: Joi.string().required(),
      //   DB_NAME: Joi.string().required(),
      //   DB_PORT: Joi.number().required(),
      //   DB_HOST: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      // }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        type: 'postgres',
        host: configService.database.dbHost,
        port: configService.database.dbPort,
        username: configService.database.dbUsername,
        password: configService.database.dbPassword,
        database: configService.database.dbName,
        autoLoadEntities: true,
        synchronize: true,
      }),
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
