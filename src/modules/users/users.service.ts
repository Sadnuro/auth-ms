import { BadRequestException, Injectable } from '@nestjs/common';
import { UserStatusEnum } from '@prisma/client';
import { BcryptService } from 'src/modules/bcrypt/bcrypt.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateUserInterface,
  FindOneUserInterface,
  UpdateUserInterface,
} from 'src/modules/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

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
      data: {
        ...user,
        password: user.password
          ? await this.bcrypt.hash(user.password)
          : undefined,
      },
    });
  }

  async update(id: string, user: UpdateUserInterface) {
    await this.findOne({ id });
    if (user.email) {
      await this.validateEmail(user.email);
    }
    return this.prisma.user.update({
      where: { id: id, status: { notIn: [UserStatusEnum.DRAFT] } },
      data: {
        ...user,
        password: user.password && (await this.bcrypt.hash(user.password)),
      },
    });
  }

  async findOne(filter: FindOneUserInterface) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: filter.id,
        email: filter.email,
        status: { notIn: [UserStatusEnum.DRAFT] },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async delete(id: string) {
    await this.findOne({ id });
    return this.prisma.user.update({
      where: { id: id },
      data: { status: UserStatusEnum.DRAFT },
    });
  }
}
