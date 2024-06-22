import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryGroup } from '../../entities/category-group.entity';
import { Product } from 'src/module/catalog/products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  slug?: string;

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.category, {
    eager: true,
  })
  categoryGroup: CategoryGroup;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
