import { Router } from 'express';

import { list, remove } from '../controllers/notification';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.get('/', wrapAsync(auth), wrapAsync(list));
router.delete('/:index', wrapAsync(auth), wrapAsync(remove));

export default router;
