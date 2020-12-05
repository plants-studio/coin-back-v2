import { Request } from 'express';
import jwt from 'jsonwebtoken';

export type ServerError = Error & {
  errno: number;
  code: string;
  path: string;
  syscall: string;
  stack: string;
};

export type Token = {
  name: string;
  email: string;
  discord: string;
  friend: string;
  notification: string;
  profile: string;
  admin: boolean;
};

export type AuthRequest = Request & {
  token: Token;
};

export type Sign = (
  payload: string | object | Buffer,
  secretOrPrivateKey: jwt.Secret,
  options: jwt.SignOptions,
) => string;

export type Verify = (
  token: string,
  secretOrPublicKey: jwt.Secret,
  options?: jwt.VerifyOptions,
) => Token | undefined;

export type Blacklist = (token: string) => void;
