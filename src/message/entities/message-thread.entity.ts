import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageThreadDocument = MessageThread & Document;

@Schema({ timestamps: true })
export class MessageThread {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  farmerId: Types.ObjectId;

  @Prop()
  lastMessageAt: Date;
}

export const MessageThreadSchema = SchemaFactory.createForClass(MessageThread);
