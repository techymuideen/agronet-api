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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FarmerApplicationService } from './farmer-application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';

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

@Controller('farmer-application')
export class FarmerApplicationController {
  constructor(
    private readonly farmerApplicationService: FarmerApplicationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() createFarmerApplicationDto: CreateFarmerApplicationDto,
  ): Promise<ApiResponse> {
    try {
      const application = await this.farmerApplicationService.create({
        ...createFarmerApplicationDto,
        userId: req.user.userId, // Use the authenticated user's ID
      });

      return {
        success: true,
        data: application,
        message: 'Farmer application created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create application',
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<ApiResponse> {
    try {
      const applications = await this.farmerApplicationService.findAll();
      return {
        success: true,
        data: applications,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch applications',
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const application = await this.farmerApplicationService.findOne(id);
      return {
        success: true,
        data: application,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch application',
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateFarmerApplicationDto: Partial<CreateFarmerApplicationDto>,
  ): Promise<ApiResponse> {
    try {
      const application = await this.farmerApplicationService.update(
        id,
        updateFarmerApplicationDto,
      );
      return {
        success: true,
        data: application,
        message: 'Application updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update application',
      };
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: 'pending' | 'approved' | 'rejected' },
  ): Promise<ApiResponse> {
    try {
      const application = await this.farmerApplicationService.updateStatus(
        id,
        statusDto.status,
      );
      return {
        success: true,
        data: application,
        message: 'Application status updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update application status',
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    try {
      await this.farmerApplicationService.remove(id);
      return {
        success: true,
        message: 'Application deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete application',
      };
    }
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Param('userId') userId: string): Promise<ApiResponse> {
    try {
      const applications =
        await this.farmerApplicationService.findByUser(userId);
      return {
        success: true,
        data: applications,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user applications',
      };
    }
  }
}
