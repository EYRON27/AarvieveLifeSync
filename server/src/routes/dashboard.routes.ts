import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware';

const router = Router();
router.use(authMiddleware);

router.get('/stats', (req, res, next) => dashboardController.getStats(req, res, next));
router.get('/activity', (req, res, next) => dashboardController.getRecentActivity(req, res, next));

export default router;
