import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FarmerApplicationDocument = FarmerApplication & Document;

@Schema({ timestamps: true })
export class FarmerApplication {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  farmName: string;

  @Prop({ required: true })
  farmLocation: string;

  @Prop({ required: true })
  farmSize: string;

  @Prop({ type: [String], required: true })
  cropsGrown: string[];

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  // Optional fields for document verification
  @Prop()
  idCardUrl?: string;

  @Prop()
  proofOfFarmUrl?: string;
}

export const FarmerApplicationSchema =
  SchemaFactory.createForClass(FarmerApplication);
