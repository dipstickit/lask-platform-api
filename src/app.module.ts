import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import RedisStore from 'connect-redis';
import { REDIS_CLIENT } from './module/redis/redis.constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './module/auth/guards/jwt-auth.guard';
import { RolesGuard } from './module/auth/guards/roles.guard';
import { VnpayModule } from './module/vnpay/vnpay.module';

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
    VnpayModule,
    // RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    // @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    // const redisStore = new RedisStore({
    //   client: this.redisClient,
    // });
  }
}
