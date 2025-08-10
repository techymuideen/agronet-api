import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FarmerApplication,
  FarmerApplicationDocument,
} from './entities/farmer-application.entity';
import { UserService } from '../users/user.service';

export interface CreateFarmerApplicationDto {
  userId: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessDescription: string;
  certifications?: string;
  experience?: string;
  products?: string;
}

@Injectable()
export class FarmerApplicationService {
  constructor(
    @InjectModel(FarmerApplication.name)
    private farmerApplicationModel: Model<FarmerApplicationDocument>,
    private userService: UserService,
  ) {}

  async create(
    createFarmerApplicationDto: CreateFarmerApplicationDto,
  ): Promise<{ success: boolean; data?: FarmerApplication; error?: string }> {
    try {
      // Check if user already has a pending application
      const existingApplication = await this.farmerApplicationModel.findOne({
        userId: new Types.ObjectId(createFarmerApplicationDto.userId),
        status: { $in: ['pending', 'approved'] },
      });

      if (existingApplication) {
        if (existingApplication.status === 'approved') {
          return {
            success: false,
            error: 'You are already an approved farmer.',
          };
        }
        return {
          success: false,
          error: 'You already have a pending application.',
        };
      }

      const farmerApplication = new this.farmerApplicationModel({
        ...createFarmerApplicationDto,
        userId: new Types.ObjectId(createFarmerApplicationDto.userId),
      });

      const savedApplication = await farmerApplication.save();

      return {
        success: true,
        data: savedApplication,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create application',
      };
    }
  }

  async findAll(): Promise<FarmerApplication[]> {
    return this.farmerApplicationModel
      .find()
      .populate('userId', 'firstname lastname email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<FarmerApplication> {
    const application = await this.farmerApplicationModel
      .findById(id)
      .populate('userId', 'firstname lastname email')
      .exec();

    if (!application) {
      throw new NotFoundException('Farmer application not found');
    }

    return application;
  }

  async findByUser(userId: string): Promise<FarmerApplication[]> {
    return this.farmerApplicationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateFarmerApplicationDto: Partial<CreateFarmerApplicationDto>,
  ): Promise<FarmerApplication> {
    const updatedApplication = await this.farmerApplicationModel
      .findByIdAndUpdate(id, updateFarmerApplicationDto, { new: true })
      .populate('userId', 'firstname lastname email')
      .exec();

    if (!updatedApplication) {
      throw new NotFoundException('Farmer application not found');
    }

    return updatedApplication;
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
  ): Promise<FarmerApplication> {
    const updatedApplication = await this.farmerApplicationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId', 'firstname lastname email')
      .exec();

    if (!updatedApplication) {
      throw new NotFoundException('Farmer application not found');
    }

    // If approving the application, update the user's role to farmer
    if (status === 'approved' && updatedApplication.userId) {
      const userId =
        typeof updatedApplication.userId === 'string'
          ? updatedApplication.userId
          : (updatedApplication.userId as any)._id?.toString();

      if (userId) {
        try {
          await this.userService.updateUserRole(userId, 'farmer');
        } catch (error) {
          console.error('Failed to update user role:', error);
          // Don't throw error here as the application was still updated
        }
      }
    }

    return updatedApplication;
  }

  async remove(id: string): Promise<void> {
    const result = await this.farmerApplicationModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Farmer application not found');
    }
  }

  async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const [total, pending, approved, rejected] = await Promise.all([
      this.farmerApplicationModel.countDocuments(),
      this.farmerApplicationModel.countDocuments({ status: 'pending' }),
      this.farmerApplicationModel.countDocuments({ status: 'approved' }),
      this.farmerApplicationModel.countDocuments({ status: 'rejected' }),
    ]);

    return { total, pending, approved, rejected };
  }
}
