import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FarmerApplicationDocument = FarmerApplication & Document;

@Schema({ timestamps: true })
export class FarmerApplication {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  businessAddress: string;

  @Prop({ required: true })
  businessPhone: string;

  @Prop({ required: true })
  businessEmail: string;

  @Prop({ required: true })
  businessDescription: string;

  @Prop()
  certifications?: string;

  @Prop()
  experience?: string;

  @Prop()
  products?: string;

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
