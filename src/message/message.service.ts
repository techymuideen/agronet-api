import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import {
  MessageThread,
  MessageThreadDocument,
} from './entities/message-thread.entity';

export interface CreateMessageDto {
  threadId?: string;
  receiverId: string;
  content: string;
  buyerId?: string;
  farmerId?: string;
}

export interface CreateThreadDto {
  buyerId: string;
  farmerId: string;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(MessageThread.name)
    private messageThreadModel: Model<MessageThreadDocument>,
  ) {}

  // Thread operations
  async createThread(
    createThreadDto: CreateThreadDto,
  ): Promise<MessageThreadDocument> {
    // Check if thread already exists between these users
    const existingThread = await this.messageThreadModel.findOne({
      $or: [
        {
          buyerId: createThreadDto.buyerId,
          farmerId: createThreadDto.farmerId,
        },
        {
          buyerId: createThreadDto.farmerId,
          farmerId: createThreadDto.buyerId,
        },
      ],
    });

    if (existingThread) {
      return existingThread;
    }

    const thread = new this.messageThreadModel({
      buyerId: new Types.ObjectId(createThreadDto.buyerId),
      farmerId: new Types.ObjectId(createThreadDto.farmerId),
      lastMessageAt: new Date(),
    });

    const savedThread = await thread.save();
    return savedThread;
  }

  async findThreadsByUser(userId: string): Promise<MessageThread[]> {
    return this.messageThreadModel
      .find({
        $or: [
          { buyerId: new Types.ObjectId(userId) },
          { farmerId: new Types.ObjectId(userId) },
        ],
      })
      .populate('buyerId', 'fullName email role')
      .populate('farmerId', 'fullName email role')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async findThreadById(threadId: string): Promise<MessageThread> {
    const thread = await this.messageThreadModel
      .findById(threadId)
      .populate('buyerId', 'fullName email role')
      .populate('farmerId', 'fullName email role')
      .exec();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread;
  }

  // Message operations
  async createMessage(
    senderId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    let threadId = createMessageDto.threadId;

    // If no threadId provided, create or find thread
    if (!threadId) {
      if (!createMessageDto.buyerId || !createMessageDto.farmerId) {
        throw new Error(
          'Either threadId or buyerId and farmerId must be provided',
        );
      }

      const thread = await this.createThread({
        buyerId: createMessageDto.buyerId,
        farmerId: createMessageDto.farmerId,
      });
      threadId = String(thread._id);
    }

    const message = new this.messageModel({
      threadId: new Types.ObjectId(threadId),
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(createMessageDto.receiverId),
      content: createMessageDto.content,
      read: false,
    });

    const savedMessage = await message.save();

    // Update thread's lastMessageAt
    await this.messageThreadModel.findByIdAndUpdate(threadId, {
      lastMessageAt: new Date(),
    });

    return savedMessage.populate(['senderId', 'receiverId']);
  }

  async findMessagesByThread(threadId: string): Promise<Message[]> {
    return this.messageModel
      .find({ threadId: new Types.ObjectId(threadId) })
      .populate('senderId', 'fullName email role')
      .populate('receiverId', 'fullName email role')
      .sort({ createdAt: 1 })
      .exec();
  }

  async findMessageById(messageId: string): Promise<Message> {
    const message = await this.messageModel
      .findById(messageId)
      .populate('senderId', 'fullName email role')
      .populate('receiverId', 'fullName email role')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async markMessageAsRead(messageId: string): Promise<Message> {
    const message = await this.messageModel
      .findByIdAndUpdate(messageId, { read: true }, { new: true })
      .populate(['senderId', 'receiverId']);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async markThreadMessagesAsRead(
    threadId: string,
    userId: string,
  ): Promise<void> {
    await this.messageModel.updateMany(
      {
        threadId: new Types.ObjectId(threadId),
        receiverId: new Types.ObjectId(userId),
        read: false,
      },
      { read: true },
    );
  }

  async deleteMessage(messageId: string): Promise<void> {
    const result = await this.messageModel.findByIdAndDelete(messageId);
    if (!result) {
      throw new NotFoundException('Message not found');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiverId: new Types.ObjectId(userId),
      read: false,
    });
  }
}
