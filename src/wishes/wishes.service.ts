import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    return await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  findAll() {
    return this.wishRepository.find();
  }

  findLastWishes() {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  findTopWishes() {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      where: {
        copied: MoreThan(0),
      },
      take: 10,
    });
  }

  findWishesByUserId(userId: number) {
    return this.wishRepository.find({
      where: { owner: { id: userId } },
      relations: {
        owner: {
          wishes: true,
          wishLists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async findManyById(createWishlistDto) {
    return await this.wishRepository.find({
      where: { id: In(createWishlistDto.itemsId || []) },
    });
  }

  async findOne(wishId: number): Promise<Wish> {
    return await this.wishRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: {
          wishes: true,
          wishLists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async update(id: number, ...param) {
    return await this.wishRepository.update(id, param[0]);
  }

  async remove(id: number) {
    return await this.wishRepository.delete({ id });
  }
}
