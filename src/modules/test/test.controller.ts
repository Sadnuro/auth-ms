import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Controller('test')
export class TestController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async test(@Body() data: any) {
    console.log(data);
    return this.usersService.create(data);
  }
}
