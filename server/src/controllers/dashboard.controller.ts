import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.userId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const activities = await dashboardService.getRecentActivity(req.userId!);
      res.json({ success: true, data: activities });
    } catch (error) { next(error); }
  }
}

export const dashboardController = new DashboardController();
