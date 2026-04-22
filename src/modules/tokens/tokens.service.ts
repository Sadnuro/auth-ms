import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InputJsonArray } from '@prisma/client/runtime/client';
import { ICreateToken, IPayloadToken } from 'src/modules/tokens/interfaces';

@Injectable()
export class TokensService {
  private readonly randomToken = () =>
    Math.floor(100000 * Math.random() * 900000).toString();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateToken({ userId, type, ttl = 900000 }: ICreateToken) {
    return await this.cacheManager.set(
      `token:${type}:user:${userId}`,
      { userId, type, token: this.randomToken() },
      ttl,
    );
  }

  async validateToken({ userId, type, token }: IPayloadToken) {
    const payload = await this.cacheManager.get<IPayloadToken>(
      `token:${type}:user:${userId}`,
    );
    if (!payload || payload.token !== token) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return payload;
  }
}
