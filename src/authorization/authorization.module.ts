import { Module } from '@nestjs/common';
import { AuthController } from './authorization.controller';
import { JwtStrategy } from './passport.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { YandexStrategy } from './yandex.strategy';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '12h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthorizationService,
    JwtStrategy,
    LocalStrategy,
    YandexStrategy,
    AuthorizationService,
  ],
  exports: [AuthorizationService, AuthorizationModule],
})
export class AuthorizationModule {}
