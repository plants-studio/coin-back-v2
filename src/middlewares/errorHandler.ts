import { Request, Response } from 'express';

import { logger } from '../configs/winston';

export default (err: any, req: Request, res: Response) => {
  const errObj = {
    err,
    req,
  };
  logger.error(`Unknown Error : ${Date.now()}`, errObj);
  res.status(500).send(err);
};
