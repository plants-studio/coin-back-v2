import { Request, Response } from 'express';

import { Team } from '../models';
import { AuthRequest, EditTeamRequestBody, ReplyApplyTeamRequestBody } from '../types';

const getTeamData = async (req: Request, res: Response) => {
  const { id } = req.params;

  const team = await Team.findById(id);
  if (!team) {
    res.sendStatus(404);
    return;
  }

  res.status(200).send(team);
};

const removeTeam = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  const team = await Team.findById(id);
  if (!team) {
    res.sendStatus(404);
    return;
  }

  if (team.leader !== token!.name) {
    res.sendStatus(403);
    return;
  }

  await team.deleteOne();
  res.sendStatus(200);
};

const editTeam = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;
  const { name, introduce }: EditTeamRequestBody = req.body;

  const team = await Team.findById(id);
  if (!team) {
    res.sendStatus(404);
    return;
  }

  if (team.leader !== token!.name) {
    res.sendStatus(403);
  }

  if (name) {
    await team.updateOne({ name });
  }
  if (introduce) {
    await team.updateOne({ introduce });
  }
  res.sendStatus(200);
};

const applyTeam = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  const team = await Team.findById(id);
  if (!team) {
    res.sendStatus(404);
    return;
  }

  await team.updateOne({ $push: { list: { name: token!.name } } });
  res.sendStatus(200);
};

const cancelApplyTeam = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  const team = await Team.findById(id);
  if (!team) {
    res.sendStatus(404);
    return;
  }

  await team.updateOne({ $pull: { list: { name: token!.name } } });
  res.sendStatus(200);
};

const replyApplyTeam = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;
  const { reply }: ReplyApplyTeamRequestBody = req.body;

  const team = await Team.findById(id);
  if (!team) {
    res.sendStatus(404);
    return;
  }

  if (team.leader !== token!.name) {
    res.sendStatus(403);
    return;
  }

  await team.updateOne({ $pull: { list: { name: token!.name } } });
  if (reply) {
    await team.updateOne({ $push: { list: { name: token!.name, status: 'PARTICIPATED' } } });
  }
  res.sendStatus(200);
};

export {
  applyTeam, cancelApplyTeam, editTeam, getTeamData, removeTeam, replyApplyTeam,
};
