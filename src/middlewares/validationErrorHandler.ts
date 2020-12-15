import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { logger } from '../configs/winston';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error.ValidationError) {
    const errObj = {
      err,
      req,
    };
    logger.error(`Validation Error : ${Date.now()}`, errObj);
    res.status(400).send(err.message);
  } else {
    next(err);
  }
};
