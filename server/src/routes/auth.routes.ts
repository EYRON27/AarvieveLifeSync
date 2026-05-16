import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, validate } from '../middleware';
import { updateUserSchema } from '../validators';

const router = Router();

router.post('/sync', authMiddleware, (req, res, next) => authController.syncUser(req, res, next));
router.get('/profile', authMiddleware, (req, res, next) => authController.getProfile(req, res, next));
router.put('/profile', authMiddleware, validate(updateUserSchema), (req, res, next) => authController.updateProfile(req, res, next));

export default router;
