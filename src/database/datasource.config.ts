import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: +configService.get<number>('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../*migrations/*{.ts,.js}')],
    autoLoadEntities: true,
    logging: true,
    synchronize: configService.get<boolean>('POSTGRES_DB_SYNC'),
    keepConnectionAlive: true,
    dropSchema: false,
  }),
  inject: [ConfigService],
};
