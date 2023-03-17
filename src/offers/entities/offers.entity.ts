import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsOptional, IsNotEmpty, NotEquals } from 'class-validator';
import { Wish } from '../../wishes/entities/wishes.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @IsNotEmpty()
  @NotEquals(0)
  @Column()
  amount: number;

  @Column({
    default: false,
  })
  @IsOptional()
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
