import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthorizationService } from './authorization.service';
import { LocalGuard } from '../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthorizationService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    const user = req.user;
    return this.authService.auth(user);
  }

  @Post('signup')
  async signup(@Body() createUser: CreateUserDto) {
    const user = await this.usersService.create(createUser);
    return this.authService.auth(user);
  }

  @UseGuards(AuthGuard('yandex'))
  @Get('yandex')
  yandex() {
    //
  }

  @UseGuards(AuthGuard('yandex'))
  @Get('yandex/callback')
  yandexCallback(@Req() req) {
    return this.authService.auth(req.user);
  }
}
