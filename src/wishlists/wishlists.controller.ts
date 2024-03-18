import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import EXCEPTIONS from '../utils/exceptions';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: AuthUserDto,
  ) {
    try {
      return await this.wishlistsService.create(createWishlistDto, req.user);
    } catch (e) {
      throw new InternalServerErrorException(EXCEPTIONS.WISHLIST_NOT_CREATED);
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return await this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.wishlistsService.findOneById(id);
    } catch (e) {
      throw new NotFoundException(EXCEPTIONS.WISHLIST_NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param() user: User,
  ) {
    try {
      return await this.wishlistsService.update(id, updateWishlistDto, user);
    } catch (e) {
      throw new InternalServerErrorException(EXCEPTIONS.WISHLIST_UPDATE_FAILED);
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: AuthUserDto) {
    try {
      return await this.wishlistsService.remove(id, req.user.id);
    } catch (e) {
      throw new InternalServerErrorException(EXCEPTIONS.WISHLIST_DELETE_FAILED);
    }
  }
}
