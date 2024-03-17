import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import EXCEPTIONS from '../utils/exceptions';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wishes = await this.wishesService.findOneById(createOfferDto.itemId);
    const wish = await this.wishesService.findOneById(wishes.id);

    const restSum = wish.price - wish.raised;

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(EXCEPTIONS.SELF_PAYMENT);
    }

    if (createOfferDto.amount > restSum || createOfferDto.amount > wish.price) {
      throw new ForbiddenException(EXCEPTIONS.EXCEED_PRICE);
    }

    await this.wishesService.updateWithRaise(
      createOfferDto.itemId,
      wish.raised + createOfferDto.amount,
    );
    const newOffer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    return await this.offersRepository.save(newOffer);
  }

  async findAll() {
    return await this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOneBy({ id });
    if (!offer) {
      throw new NotFoundException(EXCEPTIONS.OFFER_NOT_FOUND);
    }
    return offer;
  }
}
