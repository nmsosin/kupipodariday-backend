import { User } from '../../users/entities/user.entity';

export interface AuthUserDto extends Request {
  user: User;
}
