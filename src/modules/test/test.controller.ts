import { Body, Controller, Post } from '@nestjs/common';
import { BcryptService } from 'src/modules/bcrypt/bcrypt.service';
import * as interfaces from 'src/modules/tokens/interfaces';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcrypt: BcryptService,
    private readonly tokens: TokensService,
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
  @Post('/token')
  async generate(@Body() data: interfaces.ICreateToken) {
    return this.tokens.generateToken(data);
  }
  @Post('/token/validate')
  async validate(@Body() data: interfaces.IPayloadToken) {
    return this.tokens.validateToken(data);
  }
  @Post('/token/revoke')
  async revoke(@Body() data: interfaces.IRevokeToken) {
    return this.tokens.revokeToken(data);
  }
}
