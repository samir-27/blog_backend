import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() body: Partial<User>): Promise<User> {
    return this.userService.create(body);
  }

  @Post('login')
  login(@Body() body: Partial<User>): Promise<{ message: string; token: string; user: User }> {
    return this.userService.login(body);
  }
}
