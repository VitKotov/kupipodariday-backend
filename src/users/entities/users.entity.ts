import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  Length,
  IsEmail,
  MaxLength,
  MinLength,
  IsFQDN,
  IsOptional,
  IsEmpty,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wishes.entity';
import { Offer } from '../../offers/entities/offers.entity';
import { Wishlist } from '../../wishlists/entities/wishlists.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Length(2, 30, {
    message: 'от 2 до 30 символов',
  })
  @Column({
    unique: true,
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({
    unique: true,
  })
  @Column()
  email: string;

  @MinLength(2, {
    message: 'Рассказ о себе слишком короткий',
  })
  @MaxLength(200, {
    message: 'Рассказ о себе слишком большой',
  })
  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @IsOptional()
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsFQDN()
  avatar: string;

  @Column({ select: false })
  @IsNotEmpty()
  password: string;

  @IsEmpty()
  @CreateDateColumn()
  createdAt: Date;

  @IsEmpty()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsEmpty()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @IsEmpty()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @IsEmpty()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishLists: Wishlist[];
}
