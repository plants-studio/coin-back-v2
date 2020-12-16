import { Response } from 'express';

import { Notification } from '../models';
import { AuthRequest } from '../types';

const list = async (req: AuthRequest, res: Response) => {
  const { token } = req;

  const notification = await Notification.findById(token!.notification);
  res.send(notification!.list);
};

const remove = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { index } = req.params;
  if (!index) {
    res.sendStatus(412);
    return;
  }

  const i = Number.parseInt(index, 10);

  const notification = await Notification.findById(token!.notification);
  notification!.updateOne({ $pull: { list: notification!.list[i] } });
};

export { list, remove };
