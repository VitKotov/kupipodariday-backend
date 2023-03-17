import { Module, Logger } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';
import { Wish } from '../wishes/entities/wishes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish]), WishesModule, UsersModule],
  controllers: [OffersController],
  providers: [OffersService, Logger],
  exports: [OffersService, OffersModule],
})
export class OffersModule {}
