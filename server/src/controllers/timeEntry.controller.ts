import { Request, Response, NextFunction } from 'express';
import { timeEntryService } from '../services';

export class TimeEntryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await timeEntryService.getTimeEntries(req.userId!, req.query as any);
      res.json(result);
    } catch (error) { next(error); }
  }

  async startTimer(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await timeEntryService.startTimer(req.userId!, req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async stopTimer(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await timeEntryService.stopTimer(req.params.id, req.userId!);
      res.json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async createManual(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await timeEntryService.createManualEntry(req.userId!, req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await timeEntryService.deleteEntry(req.params.id, req.userId!);
      res.json({ success: true, message: 'Time entry deleted' });
    } catch (error) { next(error); }
  }

  async getRunning(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await timeEntryService.getRunningTimer(req.userId!);
      res.json({ success: true, data: entry });
    } catch (error) { next(error); }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await timeEntryService.getWeeklySummary(req.userId!);
      res.json({ success: true, data: summary });
    } catch (error) { next(error); }
  }
}

export const timeEntryController = new TimeEntryController();
