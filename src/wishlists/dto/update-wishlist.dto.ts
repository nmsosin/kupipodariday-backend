import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
} from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @IsNumber()
  @ArrayNotEmpty()
  items: number[];

  @IsOptional()
  @IsString()
  @Max(1500)
  description?: string;
}
