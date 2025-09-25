import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { GetUser } from 'src/auth/decoractor';
import { User } from 'generated/prisma';

@Controller('user')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
