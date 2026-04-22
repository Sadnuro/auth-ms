export interface ICreateSession {
  // id?: string;

  userId: string;
  refreshToken: string;

  userAgent?: string;
  ipAddress?: string;
  location?: string;
  isActive?: boolean;
  expiresAt?: Date;
}

export interface IUpdateSession {
  id: string;
  userId: string;

  refreshToken?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: string;
  isActive?: boolean;
  expiresAt?: Date;
}

export interface IGetAllSessions {
  userId: string;
}

export interface IGetSession {
  id: string;
  userId: string;
}

export interface IGetSessinByParams {
  userId: string;
  ip?: string;
  userAgent?: string;
}
