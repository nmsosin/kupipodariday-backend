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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUserDto } from '../auth/dto/auth-user.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req: AuthUserDto) {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return await this.wishesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne(id);
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

  @Get('last')
  async findLastWishes() {
    return await this.wishesService.findLastWishes();
  }
  @Get('top')
  async findTopWishes() {
    return await this.wishesService.findTopWishes();
  }

  @UseGuards(JwtGuard)
  @Post('copy')
  async copyWish(@Req() req: AuthUserDto, @Param('id') id: number) {
    return await this.wishesService.copyWish(id, req.user);
  }
}
