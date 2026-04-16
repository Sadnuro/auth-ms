import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserInterface } from 'src/modules/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });
    if (user) {
      throw new BadRequestException('Email already exists');
    }
  }

  async create(user: CreateUserInterface) {
    await this.validateEmail(user.email);
    return await this.prisma.user.create({
      data: user,
    });
  }
  async update() {}
  async findOne() {}
  async delete() {}
}
