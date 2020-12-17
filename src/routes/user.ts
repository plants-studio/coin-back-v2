import { Router } from 'express';

import { edit, get } from '../controllers/user';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.get('/:find', get);
router.put('/', wrapAsync(auth), wrapAsync(edit));

export default router;
