import { Router } from 'express';

import auth from './auth';
import league from './league';
import team from './team';

const router = Router();

router.use('/auth', auth);
router.use('/league', league);
router.use('/team', team);

export default router;
