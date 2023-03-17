import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-yandex';
import { AuthorizationService } from './authorization.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthorizationService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('YANDEX_CLIENT_ID'),
      clientSecret: configService.get('YANDEX_CLIENT_SECRET'),
      callbackURL: configService.get('YANDEX_REDIRECT_URI'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateFromYandex(profile);

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    return user;
  }
}
