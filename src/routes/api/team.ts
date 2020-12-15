import { Router } from 'express';

import {
  applyTeam,
  cancelApplyTeam,
  editTeam,
  getTeamData,
  removeTeam,
  replyApplyTeam,
} from '../../controllers/team';

const router = Router();

router.get('/:id', getTeamData);
router.delete('/:id', removeTeam);
router.put('/:id', editTeam);
router.post('/:id', applyTeam);
router.post('/:id/cancel', cancelApplyTeam);
router.post('/:id/reply', replyApplyTeam);

export default router;
