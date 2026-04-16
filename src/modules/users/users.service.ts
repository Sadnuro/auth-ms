import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserInterface } from 'src/modules/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserInterface) {
    return await this.prisma.user.create({
      data: user,
    });
  }
  async update() {}
  async findOne() {}
  async delete() {}
}
