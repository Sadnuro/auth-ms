import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { envs } from 'src/config';

// @Global()
@Module({
  imports: [
    // Redis Cache Config
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          ttl: 5000,
          stores: [new KeyvRedis(envs.REDIS_URL)],
        };
      },
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
