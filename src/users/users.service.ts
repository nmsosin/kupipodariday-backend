import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from '../helpers/hash';
import EXCEPTIONS from '../utils/exceptions';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (createUserDto.username) {
      const usernameExist = await this.findOneByUsername(
        createUserDto.username,
      );
      if (usernameExist) {
        throw new ConflictException(EXCEPTIONS.ALREADY_EXIST);
      }
    }

    if (createUserDto.email) {
      const emailExist = await this.findOneByEmail(createUserDto.email);
      if (emailExist) {
        throw new ConflictException(EXCEPTIONS.ALREADY_EXIST);
      }
    }

    const password = await HashService.generateHash(createUserDto.password);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: password,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findMany(query: string) {
    return await this.userRepository.findBy([
      { username: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ]);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(EXCEPTIONS.USER_NOT_FOUND);
    }
    return user;
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const currentUser = await this.findOne(id);

    if (updateUserDto.username) {
      const usernameExist = await this.findOneByUsername(
        updateUserDto.username,
      );
      if (usernameExist) {
        throw new ConflictException(EXCEPTIONS.ALREADY_EXIST);
      }
    }

    if (updateUserDto.email) {
      const emailExist = await this.findOneByEmail(updateUserDto.email);
      if (emailExist) {
        throw new ConflictException(EXCEPTIONS.ALREADY_EXIST);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await HashService.generateHash(
        updateUserDto.password,
      );
    }

    const modifiedUserDto: User = {
      ...currentUser,
      username: updateUserDto?.username,
      avatar: updateUserDto?.avatar,
      email: updateUserDto?.email,
      password: updateUserDto?.password,
      about: updateUserDto?.about,
    };

    await this.userRepository.update(currentUser.id, modifiedUserDto);
    return await this.findOne(id);
  }

  async findUserWishes(userId: number) {
    const currentUser = this.wishRepository.findOneBy({
      owner: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException(EXCEPTIONS.USER_NOT_FOUND);
    }

    return await this.wishRepository.findBy({
      owner: { id: userId },
    });
  }
}
