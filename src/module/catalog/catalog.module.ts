import { Module } from '@nestjs/common';
import { AttributeTypesModule } from './attribute-types/attribute-types.module';
import { ProductRatingsModule } from './product-ratings/product-ratings.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './category-group/categories/categories.module';

@Module({
  imports: [
    AttributeTypesModule,
    CategoriesModule,
    ProductRatingsModule,
    ProductsModule,
  ],
  exports: [
    AttributeTypesModule,
    CategoriesModule,
    ProductRatingsModule,
    ProductsModule,
  ],
})
export class CatalogModule {}
