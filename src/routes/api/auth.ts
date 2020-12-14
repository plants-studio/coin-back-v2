import { Router } from 'express';

import {
  edit, refresh, revoke, signIn, signUp,
} from '../../controllers/auth';
import auth from '../../middlewares/auth';

const router = Router();

router.put('/', auth, edit);
router.post('/refresh', refresh);
router.post('/revoke', revoke);
router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;
