import { Request, Response, NextFunction } from 'express';
import { foodEntryService } from '../services';

export class FoodEntryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await foodEntryService.getFoodEntries(req.userId!, req.query as any);
      res.json(result);
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await foodEntryService.createFoodEntry(req.userId!, req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await foodEntryService.updateFoodEntry(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await foodEntryService.deleteFoodEntry(req.params.id, req.userId!);
      res.json({ success: true, message: 'Food entry deleted' });
    } catch (error) { next(error); }
  }

  async getDailySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const summary = await foodEntryService.getDailySummary(req.userId!, date);
      res.json({ success: true, data: summary });
    } catch (error) { next(error); }
  }
}

export const foodEntryController = new FoodEntryController();
