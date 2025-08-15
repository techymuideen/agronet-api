import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
  ) {}

  async addToWishlist(userId: string, createWishlistDto: CreateWishlistDto) {
    try {
      const wishlistItem = await this.wishlistModel.create({
        userId,
        productId: createWishlistDto.productId,
      });
      return wishlistItem;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Product already in wishlist');
      }
      throw error;
    }
  }

  async getUserWishlist(userId: string) {
    return this.wishlistModel.find({ userId }).populate('productId').exec();
  }

  async removeFromWishlist(userId: string, productId: string) {
    const result = await this.wishlistModel
      .deleteOne({ userId, productId })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found in wishlist');
    }

    return { message: 'Product removed from wishlist' };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.wishlistModel.findOne({ userId, productId }).exec();
    return !!item;
  }
}
