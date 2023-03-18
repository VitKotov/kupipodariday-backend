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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() req, @Body() createWishlist: CreateWishlistDto) {
    const wishes = await this.wishesService.findManyById(createWishlist);
    const user = await this.usersService.findOne(req.user.id);
    return this.wishlistsService.create(createWishlist, wishes, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  async updateWishlistlists(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateWishlist(
      +id,
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  async deleteWishlist(@Req() req, @Param('id') id: number) {
    return await this.wishlistsService.removeWishlist(id, req.user.id);
  }
}
