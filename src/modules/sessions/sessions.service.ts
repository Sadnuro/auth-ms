import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  ICreateSession,
  IGetAllSessions,
  IGetSessinByParams,
  IGetSession,
  IUpdateSession,
} from 'src/modules/sessions/interfaces';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateSession) {
    return this.prisma.session.create({
      data: {
        ...data,
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async getAll({ userId }: IGetAllSessions) {
    return await this.prisma.session.findMany({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        userAgent: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });
  }

  async findOne(filter: IGetSession) {
    const session = await this.prisma.session.findUnique({
      where: { id: filter.id, userId: filter.userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async update(payload: IUpdateSession) {
    const { id, userId, ...data } = payload;
    await this.findOne({ id: id, userId: userId });
    return await this.prisma.session.update({
      where: { id: id, userId: userId },
      data: { ...data, lastUsedAt: new Date() },
    });
  }

  async delete(filter: IGetSession) {
    await this.findOne(filter);
    return this.prisma.session.delete({
      where: { id: filter.id, userId: filter.userId },
    });
  }

  async deleteAll(filter: IGetAllSessions) {
    return this.prisma.session.deleteMany({
      where: { userId: filter.userId },
    });
  }
}
