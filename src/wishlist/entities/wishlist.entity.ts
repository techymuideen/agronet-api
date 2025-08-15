import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

// Create compound index to ensure unique user-product pairs
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
