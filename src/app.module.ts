import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { envs } from 'src/config';
import { UsersModule } from './modules/users/users.module';
import { TestModule } from './modules/test/test.module';

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
    UsersModule,
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
