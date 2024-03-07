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

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber()
  @ArrayNotEmpty()
  items: number[];

  @IsOptional()
  @IsString()
  @Max(1500)
  description?: string;
}
