import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  MessageThread,
  MessageThreadSchema,
} from './entities/message-thread.entity';
import { Message, MessageSchema } from './entities/message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MessageThread.name,
        schema: MessageThreadSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
