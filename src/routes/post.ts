import { Router } from 'express';

import {
  create, list, read, remove,
} from '../controllers/post';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.get('/', wrapAsync(list));
router.post('/', wrapAsync(auth), wrapAsync(create));
router.get('/:id', wrapAsync(read));
router.delete('/:id', wrapAsync(auth), wrapAsync(remove));

export default router;
