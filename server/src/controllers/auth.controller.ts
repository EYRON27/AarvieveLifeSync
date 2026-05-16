import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';

export class AuthController {
  async syncUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid, email, displayName } = req.body;
      const user = await userService.getOrCreateUser(
        uid || req.userId!,
        email || req.userEmail!,
        displayName || 'User'
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
}

export const authController = new AuthController();
