import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Normalize email (lowercase and trim whitespace)
      const normalizedEmail = createUserDto.email.toLowerCase().trim();

      // Check if user with this email already exists (case-insensitive)
      const existingUser = await this.userModel.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
      });

      if (existingUser) {
        throw new ConflictException(
          'A user with this email address already exists',
        );
      }

      // Create new user with normalized email
      const newUser = new this.userModel({
        ...createUserDto,
        email: normalizedEmail,
      });

      return await newUser.save();
    } catch (error) {
      // Handle MongoDB duplicate key error as well (in case the check above doesn't catch it due to race conditions)
      const mongoError = error as MongoError;
      if (mongoError.code === 11000) {
        throw new ConflictException(
          'A user with this email address already exists',
        );
      }
      // Re-throw other errors (including our ConflictException)
      throw error;
    }
  }

  findAll(paginationQuery: PaginationQueryDto = {}) {
    const { limit, offset } = paginationQuery;
    const query = this.userModel.find();

    if (limit && limit > 0) {
      query.limit(limit);
    }
    if (offset != null && offset >= 0) {
      query.skip(offset);
    }
    return query.exec();
  }

  async findByEmail(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    return this.userModel.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
    });
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userModel.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
    });
    return !!user;
  }

  async updateUser(
    id: string,
    updateData: Partial<{
      role: 'buyer' | 'farmer' | 'admin';
      farmerApplicationStatus: 'pending' | 'approved' | 'rejected';
    }>,
  ) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}
