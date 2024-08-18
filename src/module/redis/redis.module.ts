import { Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const client = createClient({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        });
        client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
