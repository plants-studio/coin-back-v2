import { Request, Response } from 'express';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

import { Tag, User } from '../models';
import { AuthRequest, EditUserRequestBody } from '../types';

const edit = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { name, profile }: EditUserRequestBody = req.body;

  const user = await User.findById(token!.id);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  if (name) {
    if (name.search('#') !== -1) {
      res.sendStatus(412);
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
      res.sendStatus(409);
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

    if (existsSync(file)) {
      unlinkSync(file);
    }

    const buffer = profile.split(';base64,')[1];
    await sharp(Buffer.from(buffer, 'base64')).resize(150, 150).webp().toFile(file);
    await user.updateOne({ profile });
  }

  res.sendStatus(200);
};

const get = async (req: Request, res: Response) => {
  const { find } = req.params;

  const user = await User.findById(find) || await User.findOne({ name: find });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const tempUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    discord: user.discord,
    friend: user.friend,
    notification: user.notification,
    profile: user.profile,
    admin: user.admin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.send(tempUser);
};

export { edit, get };
