import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

// for connecting to database
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../*migrations/*{.ts,.js}')],
    autoLoadEntities: true,
    logging: true,
    synchronize: configService.get<boolean>('DB_SYNC'),
    seeds: [join(__dirname, '../database/seeds/index.ts}')],
  }),
  inject: [ConfigService],
};
