import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './database/datasource.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './module/users/users.module';
import { RoleModule } from './module/role/role.module';
import { ProductRatingsModule } from './module/catalog/product-ratings/product-ratings.module';
import { LocalFilesModule } from './module/local-files/local-files.module';
import { ProductsModule } from './module/catalog/products/products.module';
import { CatalogModule } from './module/catalog/catalog.module';
import { SettingsModule } from './module/settings/settings.module';
import { ImportExportModule } from './module/import-export/import-export.module';
import { PagesModule } from './module/pages/pages.module';
import { WishlistsModule } from './module/wishlists/wishlists.module';
import { SalesModule } from './module/sales/sales.module';
import { CartsModule } from './module/carts/carts.module';
import { CategoriesModule } from './module/catalog/categories/categories.module';
import { RedisModule } from './module/redis/redis.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisClientType } from 'redis';
import * as connectRedis from 'connect-redis';
import { REDIS_CLIENT } from './module/redis/redis.constants';
import { Client } from 'connect-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RoleModule,
    CategoriesModule,
    CatalogModule,
    ProductsModule,
    ProductRatingsModule,
    LocalFilesModule,
    SettingsModule,
    ImportExportModule,
    PagesModule,
    WishlistsModule,
    SalesModule,
    CartsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    const RedisStore = connectRedis(session);
    consumer
      .apply(
        session({
          store: new RedisStore({
            client: this.redisClient as unknown as Client,
          }),
          secret: this.configService.get<string>('session.secret', ''),
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: this.configService.get<number>('session.maxAge'),
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
