import { Body, Controller, Post } from '@nestjs/common';
import { BcryptService } from 'src/modules/bcrypt/bcrypt.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcrypt: BcryptService,
  ) {}

  @Post()
  async test(@Body() data: any) {
    console.log(data);
    return this.usersService.create(data);
  }
  @Post('/bcrypt-compare')
  async compare(@Body() data: any) {
    const password = data.password;
    const hash = data.hash;
    console.log(data);

    return this.bcrypt.compare(password, hash);
  }
}
