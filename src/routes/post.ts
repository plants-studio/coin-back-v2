import { Router } from 'express';

import { create, read } from '../controllers/post';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.post('/', wrapAsync(auth), wrapAsync(create));
router.get('/:id', wrapAsync(read));

export default router;
