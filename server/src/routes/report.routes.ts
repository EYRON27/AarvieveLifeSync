import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware';

const router = Router();
router.use(authMiddleware);

router.get('/expenses', (req, res, next) => reportController.exportExpenses(req, res, next));
router.get('/time', (req, res, next) => reportController.exportTimeEntries(req, res, next));
router.get('/food', (req, res, next) => reportController.exportFoodEntries(req, res, next));

export default router;
