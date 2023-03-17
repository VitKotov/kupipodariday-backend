import { IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  itemsId: [number];
}
