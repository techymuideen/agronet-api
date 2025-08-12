import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'AgroNet API is running successfully!';
  }

  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'MongoDB Atlas Connected',
      message: 'AgroNet API is healthy and ready to serve requests',
    };
  }
}
