import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wishes.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post('find')
  public async findMany(@Body() user): Promise<User[]> {
    return this.usersService.findUsers(user);
  }

  @Get('me')
  async findMe(@Req() req: any) {
    const { username } = req.user;
    return this.usersService.findByUsername(username);
  }

  @Get(':username')
  async findByUserName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return user;
  }

  @Get('me/wishes')
  findWishesMyUser(@Req() req): Promise<Wish[]> {
    const { id } = req.user;
    return this.wishesService.findWishesByUserId(id);
  }

  @Get(':username/wishes')
  async findWishesByUserName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const wish = await this.wishesService.findWishesByUserId(user.id);
    return wish;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() updateUser: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.update(id, updateUser);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return this.usersService.remove(+id);
  }
}
