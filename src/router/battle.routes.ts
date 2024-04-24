import { Router } from 'express';
import { BattleController } from '../controllers/battle.controller';

const router = Router();

router.get('/', BattleController.list);
router.post('/start', BattleController.start);
router.delete('/:id', BattleController.remove);

export default router;
