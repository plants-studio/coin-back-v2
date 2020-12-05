import jwt from 'jsonwebtoken';

import {
  Blacklist, Sign, Token, Verify,
} from '../types';

const jwtBlacklist = require('jwt-blacklist')(jwt);

export const sign: Sign = (payload, secretOrPrivateKey, options) => {
  const token = jwtBlacklist.sign(payload, secretOrPrivateKey, options);
  return token;
};

export const verify: Verify = (token, secretOrPublicKey, options) => {
  try {
    const verified = jwtBlacklist.verify(token, secretOrPublicKey, options) as Token;
    return verified;
  } catch {
    return undefined;
  }
};

export const blacklist: Blacklist = (token) => {
  jwtBlacklist.blacklist(token);
};
