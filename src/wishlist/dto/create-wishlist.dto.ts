import { IsMongoId } from 'class-validator';

export class CreateWishlistDto {
  @IsMongoId()
  readonly productId: string;
}
