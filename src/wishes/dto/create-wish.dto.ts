import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  raised: number;

  @IsOptional()
  owner: User;

  @IsString()
  @Length(1, 1024)
  description: string;
}
