import { Router } from 'express';
import { timeEntryController } from '../controllers/timeEntry.controller';
import { authMiddleware, validate } from '../middleware';
import { createTimeEntrySchema, updateTimeEntrySchema } from '../validators';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res, next) => timeEntryController.getAll(req, res, next));
router.get('/running', (req, res, next) => timeEntryController.getRunning(req, res, next));
router.get('/summary', (req, res, next) => timeEntryController.getSummary(req, res, next));
router.post('/start', validate(createTimeEntrySchema), (req, res, next) => timeEntryController.startTimer(req, res, next));
router.post('/manual', validate(createTimeEntrySchema), (req, res, next) => timeEntryController.createManual(req, res, next));
router.put('/:id/stop', (req, res, next) => timeEntryController.stopTimer(req, res, next));
router.delete('/:id', (req, res, next) => timeEntryController.delete(req, res, next));

export default router;
