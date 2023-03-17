import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Profile } from 'passport-yandex';
import { comparePassword } from '../utils/utils';

@Injectable()
export class AuthorizationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username, false);

    if (!user) {
      throw new NotFoundException('Wrong username or password');
    }

    return comparePassword(password, user);
  }

  async validateFromYandex(yandexProfile: Profile) {
    const user = await this.usersService.findByYandexID(yandexProfile.email);

    if (!user) {
      return await this.usersService.createFromYandex(yandexProfile);
    }
    return user;
  }
}
