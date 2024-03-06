import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, owner: User) {
    return await this.wishRepository.save({
      ...createWishDto,
      owner: owner,
    });
  }

  async findAll() {
    return await this.wishRepository.find({
      relations: ['owner', 'offers'],
    });
  }

  async findOne(id: number) {
    return await this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async update(
    currentUserId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    if (currentUserId !== wish.owner.id) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER);
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(EXCEPTIONS.MONEY_COLLECTED);
    }
    return await this.wishRepository.update(id, updateWishDto);
  }

  async remove(currentUserId: number, id: number) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    if (currentUserId !== wish.owner.id) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER);
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(EXCEPTIONS.MONEY_COLLECTED);
    }
    return await this.wishRepository.delete(id);
  }
}
