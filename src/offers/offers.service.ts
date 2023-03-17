import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offers.entity';
import { User } from '../users/entities/users.entity';
import { isOwner } from 'src/utils/utils';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, offer: CreateOfferDto) {
    const wishes = await this.wishesService.findOne(offer.itemId);
    const { id } = user;
    if (offer.amount < 0) {
      throw new BadRequestException('вложение не может быть отрицательным');
    }
    const money = wishes.price - wishes.raised;
    if (offer.amount > money) {
      throw new BadRequestException('слишком большая сумма');
    }
    await this.wishesService.update(offer.itemId, {
      raised: wishes.raised + offer.amount,
    });
    if (isOwner(id, wishes.owner.id)) {
      throw new BadRequestException('вы автор');
    }
    const wish = await this.wishesService.findOne(wishes.id);

    return this.offerRepository.save({
      ...offer,
      user,
      item: wish,
    });
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({ relations: ['item', 'user'] });
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      relations: {
        item: true,
        user: true,
      },
      where: { id },
    });
  }
}
