import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import EXCEPTIONS from '../utils/exceptions';

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

  async findMany(idCollection: number[]) {
    return this.wishRepository.find({
      where: { id: In(idCollection) },
    });
  }

  async findOneById(id: number) {
    const wish = await this.wishRepository.findOne({
      where: {
        id: Number(id),
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

    if (!wish) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    return wish;
  }

  async updateOne(
    currentUserId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findOneById(id);

    if (!wish) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    if (currentUserId !== wish.owner.id) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER_WISH);
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(EXCEPTIONS.MONEY_COLLECTED);
    }
    return await this.wishRepository.update(id, updateWishDto);
  }

  async updateWithRaise(id: number, raised: number) {
    return await this.wishRepository.update({ id: id }, { raised });
  }

  async remove(currentUserId: number, id: number) {
    const wish = await this.findOneById(id);

    if (!wish) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    if (currentUserId !== wish.owner.id) {
      throw new ForbiddenException(EXCEPTIONS.ANOTHER_USER_WISH);
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(EXCEPTIONS.MONEY_COLLECTED);
    }
    return await this.wishRepository.delete(id);
  }

  async findLastWishes() {
    const wishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });

    if (!wishes) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    return wishes;
  }

  async findTopWishes() {
    const wishes = await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
      relations: ['owner', 'offers'],
    });

    if (!wishes) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    return wishes;
  }

  async copyWish(id: number, owner: User) {
    const wishToCopy = await this.findOneById(id);

    if (!wishToCopy) {
      throw new NotFoundException(EXCEPTIONS.WISH_NOT_FOUND);
    }

    await this.wishRepository.update(id, {
      copied: (wishToCopy.copied += 1),
    });

    await this.create(
      {
        ...wishToCopy,
        raised: 0,
        owner: owner,
      },
      owner,
    );
    return {};
  }
}
