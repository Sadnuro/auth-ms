import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from 'src/modules/test/test.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
