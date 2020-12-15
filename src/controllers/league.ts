import { Request, Response } from 'express';

import { League, Team } from '../models';
import {
  AuthRequest,
  CreateLeagueRequestBody,
  CreateTeamRequestBody,
  EditLeagueRequestBody,
} from '../types';

const getLeagueList = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  if (!(page && limit)) {
    res.sendStatus(412);
    return;
  }

  const p = Number.parseInt(page.toString(), 10);
  const l = Number.parseInt(limit.toString(), 10);
  const leagueList = await League.find()
    .sort({ createdAt: -1 })
    .skip(p * l)
    .limit(l);
  res.status(200).send(leagueList);
};

const createLeague = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const {
    title,
    deadline,
    startDate,
    endDate,
    introduce,
    rule,
    thumbnail,
    game,
    teamMin,
    teamMax,
    teamMemMin,
    online,
    location,
  }: CreateLeagueRequestBody = req.body;

  const newTeam = new Team();
  await newTeam.save();

  const newLeague = new League({
    title,
    deadline,
    startDate,
    endDate,
    introduce,
    rule,
    thumbnail,
    game,
    teamMin,
    teamMax,
    teamMemMin,
    online,
    location,
    team: newTeam.id,
    host: token!.name,
  });

  await newLeague.save();
  res.sendStatus(201);
};

const getLeagueData = async (req: Request, res: Response) => {
  const { id } = req.params;

  const league = await League.findById(id);
  if (!league) {
    res.sendStatus(404);
    return;
  }

  res.status(200).send(league);
};

const removeLeague = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  const league = await League.findById(id);
  if (!league) {
    res.sendStatus(404);
    return;
  }

  if (league.host !== token!.name) {
    res.sendStatus(403);
    return;
  }

  await Promise.all(
    league.team.map(async (teamId) => {
      await Team.findByIdAndDelete(teamId);
    }),
  );

  await league.deleteOne();
  res.sendStatus(200);
};

const editLeague = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;
  const {
    title,
    deadline,
    startDate,
    endDate,
    introduce,
    rule,
    thumbnail,
    game,
    teamMin,
    teamMax,
    teamMemMin,
    online,
    location,
  }: EditLeagueRequestBody = req.body;

  const league = await League.findById(id);
  if (!league) {
    res.sendStatus(404);
    return;
  }

  if (league.host !== token!.name) {
    res.sendStatus(403);
    return;
  }

  if (title) {
    await league.updateOne({ title });
  }
  if (deadline) {
    await league.updateOne({ deadline });
  }
  if (startDate) {
    await league.updateOne({ startDate });
  }
  if (endDate) {
    await league.updateOne({ endDate });
  }
  if (introduce) {
    await league.updateOne({ introduce });
  }
  if (rule) {
    await league.updateOne({ rule });
  }
  if (thumbnail) {
    await league.updateOne({ thumbnail });
  }
  if (game) {
    await league.updateOne({ game });
  }
  if (teamMin) {
    await league.updateOne({ teamMin });
  }
  if (teamMax) {
    await league.updateOne({ teamMax });
  }
  if (teamMemMin) {
    await league.updateOne({ teamMemMin });
  }
  if (online) {
    await league.updateOne({ online });
  }
  if (location) {
    await league.updateOne({ location });
  }
  res.sendStatus(200);
};

const createTeam = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;
  const { name, introduce }: CreateTeamRequestBody = req.body;

  const league = await League.findById(id);
  if (!league) {
    res.sendStatus(404);
    return;
  }

  const newTeam = new Team({
    leader: token!.name,
    name,
    introduce,
  });
  await newTeam.save();

  await league.updateOne({ $push: { team: newTeam.id } });
  res.sendStatus(201);
};

export {
  createLeague, createTeam, editLeague, getLeagueData, getLeagueList, removeLeague,
};
