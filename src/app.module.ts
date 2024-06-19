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
import { ProductsPhotoModule } from './module/catalog/products/products-photo/products-photo.module';
import { ProductRatingsModule } from './module/catalog/product-ratings/product-ratings.module';
import { LocalFilesModule } from './module/local-files/local-files.module';
import { ProductsModule } from './module/catalog/products/products.module';
import { CatalogModule } from './module/catalog/catalog.module';
import { SettingsModule } from './module/settings/settings.module';
import { CategoryGroupModule } from './module/catalog/category-group/category-group.module';
import { CategoriesModule } from './module/catalog/category-group/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.local.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RoleModule,
    CategoriesModule,
    CatalogModule,
    ProductsModule,
    ProductsPhotoModule,
    ProductRatingsModule,
    LocalFilesModule,
    SettingsModule,
    CategoryGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
