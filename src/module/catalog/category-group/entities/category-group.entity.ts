import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Entity('category_groups')
export class CategoryGroup {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  slug?: string;

  @OneToMany(() => Category, (category) => category.categoryGroup, {
    orphanedRowAction: 'delete',
  })
  category: Category[];
}
