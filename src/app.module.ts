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
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    // MongoDB connection configuration
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agronet',
        // Connection options for MongoDB Atlas
        serverSelectionTimeoutMS: 10000, // 10 seconds
        socketTimeoutMS: 45000, // 45 seconds
        // Additional options for better performance
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 5, // Maintain a minimum of 5 socket connections
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
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
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
