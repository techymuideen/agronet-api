import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageThreadDocument = MessageThread & Document;

@Schema({ timestamps: true })
export class MessageThread {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  farmerId: Types.ObjectId;

  // Sorted pair of participant ids to enforce uniqueness regardless of ordering
  @Prop({ type: [Types.ObjectId], index: true })
  participants: Types.ObjectId[];

  @Prop()
  lastMessageAt: Date;
}

export const MessageThreadSchema = SchemaFactory.createForClass(MessageThread);

// Ensure unique thread per unordered participant pair
MessageThreadSchema.index({ participants: 1 }, { unique: true });
