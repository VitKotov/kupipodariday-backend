import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private wishesService: WishesService,
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

  async getWishlistsById(id: string) {
    const wishlist = await this.wishListRepository.findOne({
      where: [{ id: +id }],
      relations: {
        items: { offers: true },
        owner: true,
      },
    });

    wishlist.items.forEach((item) => {
      const amounts = item.offers.map((offer) => Number(offer.amount));
      item.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);
    });

    delete wishlist.owner.password;
    delete wishlist.owner.email;

    return wishlist;
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.getWishlistsById(id.toString());

    const wishes = await this.wishesService.findManyById(
      updateWishlistDto.itemsId || [],
    );

    return await this.wishListRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: wishes,
    });
  }

  async removeWishlist(id: number, userId: number) {
    const wishlist = await this.getWishlistsById(id.toString());
    await this.wishListRepository.delete(id);
    return wishlist;
  }
}
