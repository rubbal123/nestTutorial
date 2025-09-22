import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      //generate password hash
      const hashedPassword = await argon.hash(dto.password);

      //save user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
        },
      });

      const { hash, ...userWithoutHash } = user;
      //return new user
      return userWithoutHash;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('user already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    try {
      //find user
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new ForbiddenException('Invalid Credentials');
      }
      const pwMatches = await argon.verify(user.hash, dto.password);

      if (!pwMatches) {
        throw new ForbiddenException('Invalid Credentials');
      }
      const { hash, ...userWithoutHash } = user;
      return userWithoutHash;
    } catch (error) {
      throw error;
    }
  }
}
