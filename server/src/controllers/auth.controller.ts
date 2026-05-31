import { Request, Response, NextFunction } from 'express';
import { userService, authService } from '../services';

export class AuthController {
  async syncUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid, email, displayName, currency } = req.body;
      const user = await userService.getOrCreateUser(
        uid || req.userId!,
        email || req.userEmail!,
        displayName || 'User',
        currency
      );
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUser(req.userId!);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.userId!, req.body);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  async requestPasswordResetOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordResetOTP(email);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  async verifyPasswordResetOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyPasswordResetOTP(email, otp);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  async resetPasswordWithOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPasswordWithOTP(email, otp, newPassword);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }
}

export const authController = new AuthController();
