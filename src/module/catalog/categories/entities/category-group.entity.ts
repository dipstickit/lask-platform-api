import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('category_groups')
export class CategoryGroup {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  slug?: string;

  @OneToMany(() => Category, (category) => category.groups, {
    orphanedRowAction: 'delete',
  })
  categories: Category[];
}
