import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/module/role/entities/role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    dob: Date;

    @Column({ nullable: true })
    userImg: string;

    @Column({ default: true })
    isActive: boolean;

    @Index({ unique: true })
    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column({ select: false })
    password: string;

    @ManyToOne(() => Role, { eager: true })
    role: Role;

    refreshToken: string;

    @CreateDateColumn({ select: false })
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    updatedAt: Date;
}
