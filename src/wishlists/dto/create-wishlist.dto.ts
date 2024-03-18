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
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  itemsId: number[];

  @IsOptional()
  @IsString()
  @Max(1500)
  description: string;
}
