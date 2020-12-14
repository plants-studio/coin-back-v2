import deasync2 from 'deasync2';
import jwt from 'jsonwebtoken';
import { createBlackList } from 'jwt-blacklist';

import {
  Blacklist, Sign, Token, Verify,
} from '../types';

function wait<T>(promise: Promise<T>): T {
  return deasync2.await(promise);
}

const BlackList = wait(
  createBlackList({
    daySize: 7,
  }),
);

const sign: Sign = (payload, secretOrPrivateKey, options) => {
  const token = jwt.sign(payload, secretOrPrivateKey, options);
  return token;
};

const verify: Verify = (token, secretOrPublicKey, options) => {
  try {
    const verified = jwt.verify(token, secretOrPublicKey, options) as Token;
    if (BlackList.has(token)) {
      return undefined;
    }
    return verified;
  } catch {
    return undefined;
  }
};

const blacklist: Blacklist = (token) => {
  BlackList.add(token);
};

export { blacklist, sign, verify };
