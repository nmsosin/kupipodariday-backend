import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import EXCEPTIONS from '../utils/exceptions';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const wishes = await this.wishesService.findMany(createWishlistDto.itemsId);

    if (!wishes) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      items: wishes,
      owner: user,
      description: 'Коллекция',
    });

    if (!newWishlist) {
      throw new BadRequestException(EXCEPTIONS.WISHLIST_NOT_CREATED);
    }

    return await this.wishlistsRepository.save(newWishlist);
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOneById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(EXCEPTIONS.WISHLIST_NOT_FOUND);
    }

    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const currentWishlist = await this.findOneById(id);

    if (!currentWishlist) {
      throw new NotFoundException(EXCEPTIONS.WISHLIST_NOT_FOUND);
    }

    if (user.id !== currentWishlist.owner.id) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER_WISH);
    }

    const wishes = await this.wishesService.findMany(updateWishlistDto.items);

    return await this.wishlistsRepository.save({
      ...currentWishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: wishes,
      description: updateWishlistDto.description,
    });
  }

  async remove(id: number, userId: number) {
    const currentWishlist = await this.findOneById(id);

    if (!currentWishlist) {
      throw new NotFoundException(EXCEPTIONS.WISHLIST_NOT_FOUND);
    }

    if (userId !== currentWishlist.owner.id) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER_WISH);
    }

    await this.wishlistsRepository.delete(id);

    return currentWishlist;
  }
}
