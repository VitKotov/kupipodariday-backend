import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsOptional,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Length(2, 30)
  username: string;

  @MaxLength(200, {
    message: 'Pассказ о себе cлишком большой',
  })
  @IsOptional()
  about: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(2)
  password: string;
}
