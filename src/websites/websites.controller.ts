import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { User } from '../models/user/user.entity';

@Controller('users')
export class WebsitesController {
  constructor(private readonly usersService: WebsitesService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(Number(id));
  }
}
