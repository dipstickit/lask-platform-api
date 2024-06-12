import { Entity, ManyToOne } from 'typeorm';
import { Photo } from '../../../../local-files/entities/photo.entity';
import { Product } from '../../entities/product.entity';

@Entity('product_photos')
export class ProductPhoto extends Photo {
  @ManyToOne(() => Product, (product) => product.photos, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;
}
