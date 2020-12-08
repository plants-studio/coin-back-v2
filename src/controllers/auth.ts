import { pbkdf2Sync, randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

import hex from '../handlers/hex';
import { sign } from '../handlers/jwt';
import { Friend, Tag, User } from '../models';
import { SignInRequestBody, SignUpRequestBody } from '../types';

export const signIn = async (req: Request, res: Response) => {
  const { email, password }: SignInRequestBody = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send('유저를 찾을 수 없습니다');
    return;
  }

  const temp = user.password.split('|');
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
      try {
        await sharp(Buffer.from(data, 'base64')).resize(150, 150).webp().toFile(file);
        profile = `/images/profiles/${id}.webp`;
      } catch {
        profile = `/images/profiles/default${number}.webp`;
      }
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

export const signUp = async (req: Request, res: Response) => {
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
  if (tag!.tags.length === 0) {
    res.status(409).send('닉네임이 너무 많이 사용되고 있어 더 이상 사용할 수 없습니다');
    return;
  }
  await tag!.updateOne({ $pull: { tags: tag!.tags[0] } });
  const nameTag = `${name}#${tag!.tags[0]}`;

  const salt = randomBytes(16).toString('base64');
  const encrypt = pbkdf2Sync(password, salt, 100000, 64, 'SHA512').toString('base64');

  const newFriend = new Friend({ list: [] });
  await newFriend.save();

  const newUser = new User({
    name: nameTag,
    email,
    password: `${encrypt}|${salt}`,
    friend: newFriend.id,
    profile,
  });

  await newUser.save();
  res.status(200).send('계정을 성공적으로 생성했습니다');
};
