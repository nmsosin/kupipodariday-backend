import * as bcrypt from 'bcrypt';

export class HashService {
  static async generateHash(password: string) {
    return bcrypt.hash(password, 8);
  }
  static async validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
