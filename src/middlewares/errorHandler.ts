import { NextFunction, Request, Response } from 'express';

import { logger } from '../configs/winston';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const errObj = {
    err,
    req,
  };
  logger.error(`Unknown Error : ${Date.now()}`, errObj);
  console.log(`a${res}B`);
  res.status(500).send(err);
  next(err);
};
