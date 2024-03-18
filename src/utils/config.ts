import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { Offer } from '../offers/entities/offer.entity';

export const config = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'nest_project',
  entities: [User, Wish, Wishlist, Offer],
  synchronize: true,
};
