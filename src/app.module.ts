import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ProductModule } from './product/product.module';
import { FarmerApplicationModule } from './farmer-application/farmer-application.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { MessageModule } from './message/message.module';
import { AdminModule } from './admin/admin.module';
import { GeolocationModule } from './geolocation/geolocation.module';

@Module({
  imports: [
    // Make MongoDB connection optional for development
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agronet',
        // Gracefully handle connection errors
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    FarmerApplicationModule,
    ReviewModule,
    OrderModule,
    MessageModule,
    AdminModule,
    GeolocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
