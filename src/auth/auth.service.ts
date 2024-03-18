import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { HashService } from '../helpers/hash';
import EXCEPTIONS from '../utils/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);

    const isPasswordValid = await HashService.validateHash(
      password,
      user.password,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException(EXCEPTIONS.AUTH_FAILED);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
    }

    return user;
  }
}
