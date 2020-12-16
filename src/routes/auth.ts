import { Router } from 'express';

import {
  discord, edit, refresh, revoke, signIn, signUp,
} from '../controllers/auth';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.put('/', wrapAsync(auth), edit);
router.post('/discord', wrapAsync(discord));
router.post('/refresh', wrapAsync(refresh));
router.post('/revoke', revoke);
router.post('/signin', wrapAsync(signIn));
router.post('/signup', wrapAsync(signUp));

export default router;
