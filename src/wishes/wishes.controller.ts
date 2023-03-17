import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { Wish } from './entities/wishes.entity';
import { isOwner } from '../utils/utils';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWish: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(req.user, createWish);
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTopWishes();
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLastWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWish: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne(+id);
    const userId = req.user.id;
    const ownerId = wish.owner.id;
    if (isOwner(userId, ownerId)) {
      return await this.wishesService.update(+id, updateWish);
    }
    throw new ForbiddenException();
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);
    const userId = req.user.id;
    const ownerId = wish.owner.id;
    const length = wish.offers.length;
    if (length) {
      throw new BadRequestException(
        'Невозможно удалить, этот подарок уже поддержали',
      );
    }
    if (isOwner(userId, ownerId)) {
      return this.wishesService.remove(+id);
    }
    throw new ForbiddenException();
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);
    const userId = req.user.id;
    const ownerId = wish.owner.id;
    if (isOwner(userId, ownerId)) {
      throw new ConflictException();
    }
    const copyWish = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    await this.wishesService.create(req.user, copyWish);
    await this.wishesService.update(wish.id, { copied: +1 });
  }
}
