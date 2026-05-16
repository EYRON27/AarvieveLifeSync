import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services';

export class ExpenseController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await expenseService.getExpenses(req.userId!, req.query as any);
      res.json(result);
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expenseService.createExpense(req.userId!, req.body);
      res.status(201).json({ success: true, data: expense });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await expenseService.updateExpense(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: expense });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await expenseService.deleteExpense(req.params.id, req.userId!);
      res.json({ success: true, message: 'Expense deleted' });
    } catch (error) { next(error); }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await expenseService.getSummary(req.userId!);
      res.json({ success: true, data: summary });
    } catch (error) { next(error); }
  }
}

export const expenseController = new ExpenseController();
