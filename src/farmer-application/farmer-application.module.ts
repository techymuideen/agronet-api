import { Module } from '@nestjs/common';
import { FarmerApplicationService } from './farmer-application.service';
import { FarmerApplicationController } from './farmer-application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  FarmerApplication,
  FarmerApplicationSchema,
} from './entities/farmer-application.entity';
import { UserService } from '../users/user.service';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FarmerApplication.name,
        schema: FarmerApplicationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [FarmerApplicationService, UserService],
  controllers: [FarmerApplicationController],
})
export class FarmerApplicationModule {}
