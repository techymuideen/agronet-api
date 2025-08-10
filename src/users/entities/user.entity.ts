import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ enum: ['pending', 'active', 'banned'], default: 'pending' })
  accountStatus: 'pending' | 'active' | 'banned';

  @Prop({ enum: ['buyer', 'farmer', 'admin'], default: 'buyer' })
  role: 'buyer' | 'farmer' | 'admin';

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: null })
  farmerApplicationStatus?: 'pending' | 'approved' | 'rejected';

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ location: '2dsphere' }); // For geospatial queries
