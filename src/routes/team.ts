import { Router } from 'express';

import {
  applyTeam,
  cancelApplyTeam,
  editTeam,
  getTeamData,
  list,
  removeTeam,
  replyApplyTeam,
} from '../controllers/team';
import auth from '../middlewares/auth';
import wrapAsync from '../utils/wrapAsync';

const router = Router();

router.get('/', wrapAsync(list));
router.get('/:id', wrapAsync(getTeamData));
router.delete('/:id', wrapAsync(auth), wrapAsync(removeTeam));
router.put('/:id', wrapAsync(auth), wrapAsync(editTeam));
router.post('/:id', wrapAsync(auth), wrapAsync(applyTeam));
router.post('/:id/cancel', wrapAsync(auth), wrapAsync(cancelApplyTeam));
router.post('/:id/reply', wrapAsync(auth), wrapAsync(replyApplyTeam));

export default router;
