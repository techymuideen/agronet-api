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
  farmName: string;
  farmLocation: string;
  farmSize: string;
  cropsGrown: string[];
  experience: number;
  contactPhone: string;
  description: string;
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
  ): Promise<FarmerApplication> {
    // Check if user already has a pending application
    const existingApplication = await this.farmerApplicationModel.findOne({
      userId: new Types.ObjectId(createFarmerApplicationDto.userId),
      status: { $in: ['pending', 'approved'] },
    });

    if (existingApplication) {
      if (existingApplication.status === 'approved') {
        throw new ConflictException('You are already an approved farmer.');
      }
      throw new ConflictException('You already have a pending application.');
    }

    const farmerApplication = new this.farmerApplicationModel({
      ...createFarmerApplicationDto,
      userId: new Types.ObjectId(createFarmerApplicationDto.userId),
    });

    const savedApplication = await farmerApplication.save();

    // Update the user's farmerApplicationStatus to 'pending'
    await this.userService.updateUser(createFarmerApplicationDto.userId, {
      farmerApplicationStatus: 'pending',
    });

    return savedApplication;
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
    // First, get the application to get the userId
    const application = await this.farmerApplicationModel
      .findById(id)
      .populate('userId', 'firstname lastname email')
      .exec();

    if (!application) {
      throw new NotFoundException('Farmer application not found');
    }

    // Update the application status
    const updatedApplication = await this.farmerApplicationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId', 'firstname lastname email')
      .exec();

    // Update the user's role and farmerApplicationStatus based on the status
    if (status === 'approved') {
      await this.userService.updateUser(
        (application.userId as any)._id.toString(),
        {
          role: 'farmer',
          farmerApplicationStatus: 'approved',
        },
      );
    } else if (status === 'rejected') {
      await this.userService.updateUser(
        (application.userId as any)._id.toString(),
        {
          farmerApplicationStatus: 'rejected',
        },
      );
    } else if (status === 'pending') {
      await this.userService.updateUser(
        (application.userId as any)._id.toString(),
        {
          farmerApplicationStatus: 'pending',
        },
      );
    }

    return updatedApplication!;
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
