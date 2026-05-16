import { Router } from 'express';
import { foodEntryController } from '../controllers/foodEntry.controller';
import { authMiddleware, validate } from '../middleware';
import { createFoodEntrySchema, updateFoodEntrySchema } from '../validators';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res, next) => foodEntryController.getAll(req, res, next));
router.get('/summary', (req, res, next) => foodEntryController.getDailySummary(req, res, next));
router.post('/', validate(createFoodEntrySchema), (req, res, next) => foodEntryController.create(req, res, next));
router.put('/:id', validate(updateFoodEntrySchema), (req, res, next) => foodEntryController.update(req, res, next));
router.delete('/:id', (req, res, next) => foodEntryController.delete(req, res, next));

export default router;
