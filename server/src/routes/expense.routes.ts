import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { authMiddleware, validate } from '../middleware';
import { createExpenseSchema, updateExpenseSchema } from '../validators';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res, next) => expenseController.getAll(req, res, next));
router.get('/summary', (req, res, next) => expenseController.getSummary(req, res, next));
router.post('/', validate(createExpenseSchema), (req, res, next) => expenseController.create(req, res, next));
router.put('/:id', validate(updateExpenseSchema), (req, res, next) => expenseController.update(req, res, next));
router.delete('/:id', (req, res, next) => expenseController.delete(req, res, next));

export default router;
