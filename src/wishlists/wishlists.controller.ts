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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { AuthUserDto } from '../auth/dto/auth-user.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: AuthUserDto,
  ) {
    return await this.wishlistsService.create(createWishlistDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return await this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param() user: User,
  ) {
    return await this.wishlistsService.update(id, updateWishlistDto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: AuthUserDto) {
    return await this.wishlistsService.remove(id, req.user.id);
  }
}
