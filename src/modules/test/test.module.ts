import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from 'src/modules/test/test.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { BcryptModule } from 'src/modules/bcrypt/bcrypt.module';

@Module({
  imports: [UsersModule, BcryptModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
