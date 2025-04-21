import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: Partial<User>): Promise<User> {
    return this.userService.create(body);
  }

  @Post('login')
  login(@Body() body: Partial<User>): Promise<{ message: string; token: string; user: User }> {
    return this.userService.login(body);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() body: Partial<User>): Promise<User> {
    return this.userService.updateUserById(Number(id), body);
  }
}
