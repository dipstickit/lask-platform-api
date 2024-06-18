import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { CategoryGroup } from './category-group.entity';

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

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.categories, {
    eager: true,
    onDelete: 'CASCADE',
  })
  groups: CategoryGroup;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
  category: CategoryGroup[];
}
