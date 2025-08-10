import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: ['pending', 'shipped', 'delivered'], default: 'pending' })
  status: 'pending' | 'shipped' | 'delivered';
}

export const OrderSchema = SchemaFactory.createForClass(Order);
