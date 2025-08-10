import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      // Normalize email (lowercase and trim whitespace)
      const normalizedEmail = email.toLowerCase().trim();

      // Find user by email
      const user = await this.userService.findByEmail(normalizedEmail);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = { email: user.email, sub: user._id, role: user.role };
      const token = this.jwtService.sign(payload);

      // Convert Mongoose document to plain object and remove password
      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userWithoutPassword } = userObj;

      return {
        user: userWithoutPassword,
        token,
        message: 'Login successful',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role?: 'buyer' | 'farmer' | 'admin';
  }) {
    try {
      // Hash password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );

      const user = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
        role: registerDto.role || 'buyer',
      });

      // Generate JWT token
      const payload = { email: user.email, sub: user._id, role: user.role };
      const token = this.jwtService.sign(payload);

      // Convert Mongoose document to plain object and remove password
      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userWithoutPassword } = userObj;

      return {
        user: userWithoutPassword,
        token,
        message: 'Registration successful',
      };
    } catch (error) {
      throw error; // Let the user service handle the error (like email conflicts)
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userWithoutPassword } = userObj;

      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getProfile(token: string) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.validateToken(token);
  }
}
