import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  async addToWishlist(
    @Request() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    try {
      const item = await this.wishlistService.addToWishlist(
        req.user.userId,
        createWishlistDto,
      );
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  async getUserWishlist(@Request() req) {
    try {
      const wishlist = await this.wishlistService.getUserWishlist(
        req.user.userId,
      );
      return { success: true, data: wishlist };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async removeFromWishlist(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    try {
      const result = await this.wishlistService.removeFromWishlist(
        req.user.userId,
        productId,
      );
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('check/:productId')
  async checkWishlist(@Request() req, @Param('productId') productId: string) {
    try {
      const isInWishlist = await this.wishlistService.isInWishlist(
        req.user.userId,
        productId,
      );
      return { success: true, isInWishlist };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
