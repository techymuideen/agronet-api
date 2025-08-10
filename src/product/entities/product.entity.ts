import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  farmerId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop([String])
  images: string[];

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0],
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ default: 0 })
  ratingsAverage: number;

  @Prop({ default: 0 })
  ratingsCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ location: '2dsphere' });
