import { Request, Response, NextFunction } from 'express';
import { passwordService } from '../services';

export class PasswordController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await passwordService.getPasswords(req.userId!, req.query as any);
      res.json(result);
    } catch (error) { next(error); }
  }

  async getDecrypted(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await passwordService.getDecryptedPassword(req.params.id, req.userId!);
      res.json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await passwordService.createPassword(req.userId!, req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await passwordService.updatePassword(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await passwordService.deletePassword(req.params.id, req.userId!);
      res.json({ success: true, message: 'Password entry deleted' });
    } catch (error) { next(error); }
  }
}

export const passwordController = new PasswordController();
