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
  FarmerApplicationService,
  CreateFarmerApplicationDto,
} from './farmer-application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface UpdateFarmerApplicationStatusDto {
  status: 'approved' | 'rejected';
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
  ) {
    return this.farmerApplicationService.create({
      ...createFarmerApplicationDto,
      userId: req.user.userId, // Use the authenticated user's ID
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.farmerApplicationService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.farmerApplicationService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateFarmerApplicationStatusDto,
  ) {
    return this.farmerApplicationService.updateStatus(
      id,
      updateStatusDto.status,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.farmerApplicationService.remove(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Param('userId') userId: string) {
    return this.farmerApplicationService.findByUser(userId);
  }
}
