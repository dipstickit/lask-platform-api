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
import { CategoriesModule } from './module/categories/categories.module';
import { PropertiesModule } from './module/properties/properties.module';
import { ProductsModule } from './module/products/products.module';
import { ProductsPhotoModule } from './module/products-photo/products-photo.module';

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
    PropertiesModule,
    ProductsModule,
    ProductsPhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
