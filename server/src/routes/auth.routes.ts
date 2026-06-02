import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, validate } from '../middleware';
import { updateUserSchema } from '../validators';

const router = Router();

router.post('/sync', authMiddleware, (req, res, next) => authController.syncUser(req, res, next));
router.get('/profile', authMiddleware, (req, res, next) => authController.getProfile(req, res, next));
router.put('/profile', authMiddleware, validate(updateUserSchema), (req, res, next) => authController.updateProfile(req, res, next));
router.delete('/profile', authMiddleware, (req, res, next) => authController.deleteAccount(req, res, next));

// OTP Password Reset Routes (No authMiddleware)
router.post('/forgot-password/request-otp', (req, res, next) => authController.requestPasswordResetOTP(req, res, next));
router.post('/forgot-password/verify-otp', (req, res, next) => authController.verifyPasswordResetOTP(req, res, next));
router.post('/forgot-password/reset', (req, res, next) => authController.resetPasswordWithOTP(req, res, next));

// OTP Signup Routes
router.post('/signup/request-otp', (req, res, next) => authController.requestSignupOTP(req, res, next));
router.post('/signup/verify-and-register', (req, res, next) => authController.verifyAndRegisterUser(req, res, next));

export default router;
