import { Request } from 'express';
import jwt from 'jsonwebtoken';

type ServerError = Error & {
  errno: number;
  code: string;
  path: string;
  syscall: string;
  stack: string;
};

type Token = {
  id: string;
  name: string;
  email: string;
  discord?: string;
  friend: string;
  notification: string;
  profile?: string;
  admin: boolean;
};

type AuthRequest = Request & {
  token?: Token;
};

type Sign = (
  payload: string | object | Buffer,
  secretOrPrivateKey: jwt.Secret,
  options?: jwt.SignOptions,
) => string;

type Verify = (
  token: string,
  secretOrPublicKey: jwt.Secret,
  options?: jwt.VerifyOptions,
) => Promise<Token | undefined>;

type Blacklist = (token: string) => void;

type SignInRequestBody = {
  email: string;
  password: string;
};

type SignUpRequestBody = {
  name: string;
  email: string;
  password: string;
  profile?: string;
};

type EditUserRequestBody = {
  name?: string;
  profile?: string;
};

export {
  AuthRequest,
  Blacklist,
  EditUserRequestBody,
  ServerError,
  Sign,
  SignInRequestBody,
  SignUpRequestBody,
  Token,
  Verify,
};
