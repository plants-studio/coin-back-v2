import DiscordOAuth2 from 'discord-oauth2';
import { NextFunction, Response } from 'express';

import { User } from '../models';
import { AuthRequest, Token } from '../types';
import { verify } from '../utils/jwt';

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.substring(7);
    if (token.split('.').length === 3) {
      const verified = await verify(token, process.env.ACCESS_SECRET!);
      if (!verified) {
        res.sendStatus(401);
        return;
      }
      req.token = verified;
      next();
    } else {
      const oauth = new DiscordOAuth2();
      const user = await oauth.getUser(token);
      if (!user.verified) {
        res.sendStatus(401);
        return;
      }
      const userData = ((await User.findOne({ discord: user.id })) as unknown) as Token;
      if (!userData) {
        res.sendStatus(404);
        return;
      }
      req.token = userData;
      next();
    }
  } else {
    res.sendStatus(401);
  }
};
