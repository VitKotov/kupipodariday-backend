import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
  ) {}

  async create(wishlist: CreateWishlistDto, wishes, user) {
    return await this.wishListRepository.save({
      ...wishlist,
      owner: user,
      items: wishes,
    });
  }

  findAll() {
    return this.wishListRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  findOne(id: number) {
    return this.wishListRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
  }

  public async update(id: number, updateWishlist: UpdateWishlistDto) {
    return this.wishListRepository.update(id, updateWishlist);
  }

  public async remove(id: number): Promise<any> {
    return this.wishListRepository.delete(id);
  }
}
