import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { ProductPhoto } from '../products-photo/entities/products-photo.entity';
import { ProductRating } from '../../product-ratings/entities/product-rating.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  name: string;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ default: true })
  visible: boolean;

  @Column()
  description: string;

  @Column()
  stock: number;

  @OneToMany(() => Attribute, (attribute) => attribute.product, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  attributes: Attribute[];

  @OneToMany(() => ProductPhoto, (photo) => photo.product, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  photos: ProductPhoto[];

  @Column({ default: '' })
  photosOrder: string;

  @OneToMany(() => ProductRating, (rating) => rating.product, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  ratings: ProductRating[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;
}
