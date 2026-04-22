import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InputJsonArray } from '@prisma/client/runtime/client';
import { AuthorizationToken } from 'src/common/enum';
import {
  ICreateToken,
  IPayloadToken,
  IRevokeToken,
} from 'src/modules/tokens/interfaces';

@Injectable()
export class TokensService {
  private readonly randomToken = () =>
    Math.floor(100000 * Math.random() * 900000).toString();
  private readonly getKey = (userId: string, type: AuthorizationToken) =>
    `token:${type}:user:${userId}`;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateToken(data: ICreateToken) {
    try {
      return await this.cacheManager.set(
        this.getKey(data.userId, data.type),
        { userId: data.userId, type: data.type, token: this.randomToken() },
        data.ttl ?? 900000,
      );
    } catch (error) {
      throw new BadRequestException('Failed to generate token');
    }
  }

  async validateToken(data: IPayloadToken) {
    try {
      const payload = await this.cacheManager.get<IPayloadToken>(
        this.getKey(data.userId, data.type),
      );
      if (!payload || payload.token !== data.token) {
        throw new UnauthorizedException('Invalid or expired token.');
      }
      return payload;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async revokeToken(data: IRevokeToken) {
    try {
      return await this.cacheManager.del(this.getKey(data.userId, data.type));
    } catch (error) {
      throw new BadRequestException('Failed to revoke token');
    }
  }
}
