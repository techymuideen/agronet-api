import { Module } from '@nestjs/common';
import { FarmerApplicationService } from './farmer-application.service';
import { FarmerApplicationController } from './farmer-application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import {
  FarmerApplication,
  FarmerApplicationSchema,
} from './entities/farmer-application.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FarmerApplication.name,
        schema: FarmerApplicationSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  providers: [FarmerApplicationService],
  controllers: [FarmerApplicationController],
})
export class FarmerApplicationModule {}
