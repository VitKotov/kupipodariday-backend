import {
  Length,
  IsNotEmpty,
  MinLength,
  IsEmail,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @MaxLength(200, {
    message: 'Pассказ о себе cлишком большой',
  })
  @IsOptional()
  about: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  password: string;
}
