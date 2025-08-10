import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'MessageThread', required: true })
  threadId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
