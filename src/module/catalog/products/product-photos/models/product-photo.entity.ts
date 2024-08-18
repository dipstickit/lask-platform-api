import { Entity, ManyToOne } from 'typeorm';
import { Product } from '../../models/product.entity';
import { Photo } from 'src/module/local-files/entities/photo.entity';

@Entity('product_photos')
export class ProductPhoto extends Photo {
  @ManyToOne(() => Product, (product) => product.photos, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;
}
