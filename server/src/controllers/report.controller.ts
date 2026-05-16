import { Request, Response, NextFunction } from 'express';
import { pdfService } from '../services';
import { expenseRepository } from '../repositories';
import { timeEntryRepository } from '../repositories';
import { foodEntryRepository } from '../repositories';

export class ReportController {
  async exportExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = await expenseRepository.findByUserId(req.userId!, { limit: 200 });
      const doc = pdfService.generateExpenseReport(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=expense-report.pdf');
      doc.pipe(res);
      doc.end();
    } catch (error) { next(error); }
  }

  async exportTimeEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = await timeEntryRepository.findByUserId(req.userId!, { limit: 200 });
      const doc = pdfService.generateTimeReport(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=time-report.pdf');
      doc.pipe(res);
      doc.end();
    } catch (error) { next(error); }
  }

  async exportFoodEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = await foodEntryRepository.findByUserId(req.userId!, { limit: 200 });
      const doc = pdfService.generateFoodReport(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=food-report.pdf');
      doc.pipe(res);
      doc.end();
    } catch (error) { next(error); }
  }
}

export const reportController = new ReportController();
