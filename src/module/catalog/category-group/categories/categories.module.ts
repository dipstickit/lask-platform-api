import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryGroup } from '../entities/category-group.entity';
import { CategoryGroupModule } from '../category-group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CategoryGroupModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
