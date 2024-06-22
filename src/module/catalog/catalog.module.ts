import { Module } from '@nestjs/common';
import { AttributeTypesModule } from './attribute-types/attribute-types.module';
import { ProductRatingsModule } from './product-ratings/product-ratings.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './category-group/categories/categories.module';
import { CategoryGroupModule } from './category-group/category-group.module';

@Module({
  imports: [
    AttributeTypesModule,
    CategoriesModule,
    ProductRatingsModule,
    ProductsModule,
    CategoryGroupModule,
  ],
  exports: [
    AttributeTypesModule,
    CategoriesModule,
    ProductRatingsModule,
    ProductsModule,
    CategoryGroupModule,
  ],
})
export class CatalogModule {}
