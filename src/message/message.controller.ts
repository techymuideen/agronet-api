import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  MessageService,
  CreateMessageDto,
  CreateThreadDto,
} from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Thread endpoints
  @Post('thread')
  async createThread(@Body() createThreadDto: CreateThreadDto) {
    return this.messageService.createThread(createThreadDto);
  }

  @Get('threads')
  async getMyThreads(@Request() req) {
    return this.messageService.findThreadsByUser(req.user.userId);
  }

  @Get('thread/:id')
  async getThread(@Param('id') id: string) {
    return this.messageService.findThreadById(id);
  }

  @Get('thread/:id/messages')
  async getThreadMessages(@Param('id') threadId: string) {
    return this.messageService.findMessagesByThread(threadId);
  }

  @Patch('thread/:id/mark-read')
  async markThreadAsRead(@Param('id') threadId: string, @Request() req) {
    await this.messageService.markThreadMessagesAsRead(
      threadId,
      req.user.userId,
    );
    return { message: 'Thread messages marked as read' };
  }

  // Message endpoints
  @Post()
  async createMessage(
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const message = await this.messageService.createMessage(
        req.user.userId,
        createMessageDto,
      );
      return {
        success: true,
        data: message,
        message: 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send message',
      };
    }
  }

  @Get(':id')
  async getMessage(@Param('id') id: string) {
    return this.messageService.findMessageById(id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messageService.markMessageAsRead(id);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    await this.messageService.deleteMessage(id);
    return { message: 'Message deleted successfully' };
  }

  @Get('unread/count')
  async getUnreadCount(@Request() req) {
    const count = await this.messageService.getUnreadCount(req.user.userId);
    return { count };
  }
}
