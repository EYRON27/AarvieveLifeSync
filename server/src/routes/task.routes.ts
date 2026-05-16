import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authMiddleware, validate } from '../middleware';
import { createTaskSchema, updateTaskSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => taskController.getAll(req, res, next));
router.get('/stats', (req, res, next) => taskController.getStats(req, res, next));
router.get('/:id', (req, res, next) => taskController.getById(req, res, next));
router.post('/', validate(createTaskSchema), (req, res, next) => taskController.create(req, res, next));
router.put('/:id', validate(updateTaskSchema), (req, res, next) => taskController.update(req, res, next));
router.delete('/:id', (req, res, next) => taskController.delete(req, res, next));

export default router;
