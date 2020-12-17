import { Router } from 'express';

import {
  discord, refresh, revoke, signIn, signUp,
} from '../controllers/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.post('/discord', wrapAsync(discord));
router.post('/refresh', wrapAsync(refresh));
router.post('/revoke', revoke);
router.post('/signin', wrapAsync(signIn));
router.post('/signup', wrapAsync(signUp));

export default router;
