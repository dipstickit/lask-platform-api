import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './database/datasource.config';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './module/users/users.module';
import { RoleModule } from './module/role/role.module';
import { CategoriesModule } from './module/catalog/categories/categories.module';
import { ProductsPhotoModule } from './module/catalog/products/products-photo/products-photo.module';
import { ProductRatingsModule } from './module/catalog/product-ratings/product-ratings.module';
import { LocalFilesModule } from './module/local-files/local-files.module';
import { ProductsModule } from './module/catalog/products/products.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.local.env',
  }),
  TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RoleModule,
    CategoriesModule,
    ProductsModule,
    ProductsPhotoModule,
    ProductRatingsModule,
    LocalFilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
