import { Router } from 'express';

import {
  createLeague,
  createTeam,
  editLeague,
  getLeagueData,
  getLeagueList,
  removeLeague,
} from '../controllers/league';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.get('/', wrapAsync(getLeagueList));
router.post('/', wrapAsync(auth), wrapAsync(createLeague));
router.get('/:id', wrapAsync(getLeagueData));
router.delete('/:id', wrapAsync(auth), wrapAsync(removeLeague));
router.put('/:id', wrapAsync(auth), wrapAsync(editLeague));
router.post('/:id/team', wrapAsync(auth), wrapAsync(createTeam));

export default router;
