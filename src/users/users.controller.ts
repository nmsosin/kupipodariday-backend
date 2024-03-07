import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import EXCEPTIONS from '../utils/exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getAuthUser(@Req() req: AuthUserDto) {
    try {
      return this.usersService.findOne(req.user.id);
    } catch (error) {
      throw new NotFoundException(EXCEPTIONS.USER_NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(
    @Req() req: AuthUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.usersService.findOne(req.user.id);

    if (!user) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER_PROFILE);
    }

    await this.usersService.update(req.user.id, updateUserDto);

    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMyWishes(@Req() req: AuthUserDto) {
    const { id } = req.user;

    try {
      return await this.usersService.findUserWishes(id);
    } catch (error) {
      throw new NotFoundException(EXCEPTIONS.WISHLIST_NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    try {
      return await this.usersService.findOneByUsername(username);
    } catch (error) {
      throw new NotFoundException(EXCEPTIONS.USER_NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username: string) {
    try {
      const user = await this.usersService.findOneByUsername(username);

      return await this.usersService.findUserWishes(user.id);
    } catch (error) {
      throw new NotFoundException(EXCEPTIONS.WISHLIST_NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findUsers(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }
}
