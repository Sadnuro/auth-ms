import { AuthorizationToken } from 'src/common/enum';

export interface ICreateToken {
  userId: string;
  type: AuthorizationToken;
  ttl?: number;
}

export interface IPayloadToken {
  userId: string;
  type: AuthorizationToken;
  token: string;
}

export interface IRevokeToken {
  userId: string;
  type: AuthorizationToken;
}

export interface ITokenResponse {
  token: string;
}
