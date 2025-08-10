import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(
    @Body()
    registerDto: {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      role?: 'buyer' | 'farmer' | 'admin';
    },
  ) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  async getProfile(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    return this.authService.getProfile(token);
  }

  // Debug endpoint to check existing users
  @Get('debug/users')
  async getUsers() {
    const users = await this.userService.findAll({ limit: 100, offset: 0 });
    return {
      count: users.length,
      users: users.map((user) => ({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt || new Date(),
      })),
    };
  }

  // Debug endpoint to check if email exists
  @Get('debug/check-email')
  async checkEmail(@Body() body: { email: string }) {
    const exists = await this.userService.checkEmailExists(body.email);
    return { email: body.email, exists };
  }
}
