import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Customer,
  })
  role: Role;

  @Column({
    length: 500,
    select: false,
    nullable: true,
  })
  refreshToken: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
