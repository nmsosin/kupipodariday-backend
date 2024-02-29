import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (createUserDto.username) {
      const usernameExist = await this.findOneByUsername(
        createUserDto.username,
      );
      if (usernameExist) {
        throw new ConflictException(EXCEPTIONS.Conflict);
      }
    }

    if (createUserDto.email) {
      const emailExist = await this.findOneByEmail(createUserDto.email);
      if (emailExist) {
        throw new ConflictException(EXCEPTIONS.Conflict);
      }
    }

    const password = await bcrypt.hash(createUserDto.password, 8);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: password,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
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
        throw new ConflictException(EXCEPTIONS.Conflict);
      }
    }

    if (updateUserDto.email) {
      const emailExist = await this.findOneByEmail(updateUserDto.email);
      if (emailExist) {
        throw new ConflictException(EXCEPTIONS.Conflict);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
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
}
