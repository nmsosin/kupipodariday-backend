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
  NotFoundException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import EXCEPTIONS from '../utils/exceptions';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req: AuthUserDto) {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  async findLastWishes() {
    try {
      return await this.wishesService.findLastWishes();
    } catch (err) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }
  }
  @Get('top')
  async findTopWishes() {
    try {
      return await this.wishesService.findTopWishes();
    } catch (err) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return await this.wishesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOneById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req: AuthUserDto,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(req.user.id, id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Req() req: AuthUserDto, @Param('id') id: number) {
    return await this.wishesService.remove(req.user.id, id);
  }

  @UseGuards(JwtGuard)
  @Post('copy')
  async copyWish(@Req() req: AuthUserDto, @Param('id') id: number) {
    return await this.wishesService.copyWish(id, req.user);
  }
}
