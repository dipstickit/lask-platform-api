import { User } from 'src/module/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,

} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_name: string;

  @Column()
  description: string;

  @OneToMany((type) => User, (user) => user.role)
  user: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', select: false })
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', name: 'updated_at' ,select: false })
  updatedAt: Date;
}
