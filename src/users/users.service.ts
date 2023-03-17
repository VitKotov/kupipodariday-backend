import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {
    const hash = await this.hashedPassword(createUser.password);
    const user = this.userRepository.create({
      ...createUser,
      password: hash,
    });
    return await this.userRepository.save(user);
  }

  async hashedPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string, removePass = true): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
        wishLists: true,
      },
    });
    return !removePass ? this.userWithPassword(username) : user;
  }

  async findUsers(user): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: user.query }, { email: user.query }],
    });
  }

  async update(id: number, updateUser: UpdateUserDto) {
    let newPassword;
    const password = updateUser.password;
    if (password) {
      newPassword = await this.hashedPassword(password);
      return this.userRepository.update(id, {
        ...updateUser,
        password: newPassword,
      });
    }
    const updatedUser = await this.userRepository.findOne({
      where: { id: id },
    });
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async createFromYandex(profile: any) {
    return this.userRepository.save(profile);
  }

  async findByYandexID(email) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async userWithPassword(username) {
    const queryBuilder = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where(`user.username = :username`, { username: `${username}` })
      .addSelect('user.password');
    return await queryBuilder.getOne();
  }
}
