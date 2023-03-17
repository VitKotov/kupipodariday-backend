import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Offer } from '../../offers/entities/offers.entity';
import { IsInt, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(1, 250, {
    message: 'от 1 до 250 символов',
  })
  @Column()
  name: string;

  @IsUrl()
  @Column()
  link: string;

  @IsUrl()
  @Column()
  image: string;

  @Column()
  price: number;

  @IsInt()
  @Column({
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @JoinTable()
  offers: Offer[];

  @IsInt()
  @Column({
    default: 0,
  })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
