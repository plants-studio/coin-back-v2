import { pbkdf2Sync, randomBytes } from 'crypto';
import DiscordOAuth2 from 'discord-oauth2';
import { Request, Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

import hex from '../handlers/hex';
import { blacklist, sign, verify } from '../handlers/jwt';
import {
  Friend, Notification, Tag, User,
} from '../models';
import {
  AuthRequest, EditUserRequestBody, SignInRequestBody, SignUpRequestBody,
} from '../types';

const discord = async (req: Request, res: Response) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.substring(7);
    const oauth = new DiscordOAuth2();
    const user = await oauth.getUser(token);
    if (!user.verified) {
      res.sendStatus(401);
      return;
    }

    if (!user.email) {
      res.sendStatus(412);
      return;
    }

    const emailCheck = await User.findOne({ email: user.email });
    if (emailCheck) {
      res.sendStatus(409);
      return;
    }

    const userData = await User.findOne({ discord: user.id });
    if (!userData) {
      const nameTag = `${user.username}#${user.discriminator}`;
      const newFriend = new Friend({ list: [] });
      await newFriend.save();
      const newNotification = new Notification({ list: [] });
      await newNotification.save();
      const newUser = new User({
        email: user.email,
        name: nameTag,
        discord: user.id,
        friend: newFriend.id,
        notification: newNotification.id,
        // TODO Profile with discord avatar
      });
      await newUser.save();
      res.status(200).send({
        email: user.email,
        name: nameTag,
        friend: newFriend.id,
        notification: newNotification.id,
        // TODO Profile with discord avatar
      });
      return;
    }

    res.status(200).send({
      email: userData.email,
      name: userData.name,
      friend: userData.friend,
      notification: userData.notification,
      // TODO Profile with discord avatar
    });
  } else {
    res.sendStatus(401);
  }
};

const edit = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { name, profile }: EditUserRequestBody = req.body;

  const user = await User.findById(token!.id);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  console.log(token);
  if (name) {
    if (name.search('#') !== -1) {
      res.status(412).send("닉네임에는 '#'이 포함될 수 없습니다");
      return;
    }

    let tag = await Tag.findOne({ name });
    if (!tag) {
      const newTag = new Tag({
        name,
      });
      await newTag.save();
      tag = newTag;
    }
    if (tag!.list.length === 0) {
      res.status(409).send('닉네임이 너무 많이 사용되고 있어 더 이상 사용할 수 없습니다');
      return;
    }
    const oldName = token!.name.split('#');
    const oldTag = await Tag.findOne({ name: oldName[0] });
    const nameTag = `${name}#${tag!.list[0]}`;
    await oldTag!.updateOne({ $push: { list: Number.parseInt(oldName[1], 10) } });
    await tag!.updateOne({ $pull: { list: tag!.list[0] } });
    await user.updateOne({ name: nameTag });
  }
  if (profile) {
    const id = Buffer.from(token!.id).toString('base64');
    const dir = path.join(__dirname, '..', 'public', 'images', 'profiles');
    const file = path.join(dir, `${id}.webp`);
    try {
      readFileSync(file);
      unlinkSync(file);
    } finally {
      const buffer = profile.split(';base64,')[1];
      await sharp(Buffer.from(buffer, 'base64')).resize(150, 150).webp().toFile(file);
    }
    await user.updateOne({ profile });
  }

  res.sendStatus(200);
};

const refresh = async (req: Request, res: Response) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.substring(7);
    if (token.split('.').length === 3) {
      const verified = verify(token, process.env.REFRESH_SECRET!);
      if (!verified) {
        res.sendStatus(401);
        return;
      }
      const accessToken = sign(verified, process.env.ACCESS_SECRET!, { expiresIn: '7h' });
      const refreshToken = sign(verified, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
      res.status(200).send({ token: { accessToken, refreshToken } });
    } else {
      const oauth = new DiscordOAuth2();
      const newToken = await oauth.tokenRequest({
        scope: 'identify email',
        grantType: 'refresh_token',
        refreshToken: token,
        clientId: process.env.DISCORD_ID,
        clientSecret: process.env.DISCORD_SECRET,
      });
      res.status(200).send(newToken);
    }
  } else {
    res.sendStatus(401);
  }
};

const revoke = (req: Request, res: Response) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.substring(7);
    if (token.split('.').length === 3) {
      blacklist(token);
      res.sendStatus(200);
    } else {
      const oauth = new DiscordOAuth2();
      oauth.revokeToken(
        token,
        Buffer.from(`${process.env.DISCORD_ID}:${process.env.DISCORD_SECRET}`).toString('base64'),
      );
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(401);
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password }: SignInRequestBody = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send('유저를 찾을 수 없습니다');
    return;
  }

  const temp = user.password!.split('|');
  const encrypt = pbkdf2Sync(password, temp[1], 100000, 64, 'SHA512').toString('base64');
  if (temp[0] !== encrypt) {
    res.status(401).send('비밀번호가 옳지 않습니다');
    return;
  }

  const number = (hex(user.id.toString()) % 10) + 1;
  let profile;
  if (user.profile) {
    const id = Buffer.from(user.id).toString('base64');
    const dir = path.join(__dirname, '..', 'public', 'images', 'profiles');
    const file = path.join(dir, `${id}.webp`);
    try {
      readFileSync(file);
      profile = `/images/profiles/${id}.webp`;
    } catch {
      const data = user.profile.split(';base64,')[1];
      await sharp(Buffer.from(data, 'base64')).resize(150, 150).webp().toFile(file);
      profile = `/images/profiles/${id}.webp`;
    }
  } else {
    profile = `/images/profiles/default${number}.webp`;
  }

  const tempUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    discord: user.discord,
    friend: user.friend,
    notification: user.notification,
    profile,
    admin: user.admin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const accessToken = sign(tempUser, process.env.ACCESS_SECRET!, { expiresIn: '7h' });
  const refreshToken = sign(tempUser, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
  res.status(200).send({ token: { accessToken, refreshToken } });
};

const signUp = async (req: Request, res: Response) => {
  const {
    name, email, password, profile,
  }: SignUpRequestBody = req.body;

  if (name.search('#') !== -1) {
    res.status(412).send("닉네임에는 '#'이 포함될 수 없습니다");
    return;
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(409).send('이미 사용되고 있는 이메일입니다');
    return;
  }

  let tag = await Tag.findOne({ name });
  if (!tag) {
    const newTag = new Tag({
      name,
    });
    await newTag.save();
    tag = newTag;
  }
  if (tag!.list.length === 0) {
    res.status(409).send('닉네임이 너무 많이 사용되고 있어 더 이상 사용할 수 없습니다');
    return;
  }
  await tag!.updateOne({ $pull: { list: tag!.list[0] } });
  const nameTag = `${name}#${tag!.list[0]}`;

  const salt = randomBytes(16).toString('base64');
  const encrypt = pbkdf2Sync(password, salt, 100000, 64, 'SHA512').toString('base64');

  const newFriend = new Friend();
  await newFriend.save();
  const newNotification = new Notification();
  await newNotification.save();

  const newUser = new User({
    name: nameTag,
    email,
    password: `${encrypt}|${salt}`,
    friend: newFriend.id,
    notification: newNotification.id,
    profile,
  });

  await newUser.save();
  res.status(200).send('계정을 성공적으로 생성했습니다');
};

export {
  discord, edit, refresh, revoke, signIn, signUp,
};
