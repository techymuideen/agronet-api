import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAllUsers(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }
}
