import { Router } from 'express';
import { passwordController } from '../controllers/password.controller';
import { authMiddleware, validate } from '../middleware';
import { createPasswordSchema, updatePasswordSchema } from '../validators';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res, next) => passwordController.getAll(req, res, next));
router.get('/:id/decrypt', (req, res, next) => passwordController.getDecrypted(req, res, next));
router.post('/', validate(createPasswordSchema), (req, res, next) => passwordController.create(req, res, next));
router.put('/:id', validate(updatePasswordSchema), (req, res, next) => passwordController.update(req, res, next));
router.delete('/:id', (req, res, next) => passwordController.delete(req, res, next));

export default router;
