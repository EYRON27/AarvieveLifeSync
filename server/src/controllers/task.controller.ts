import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services';

export class TaskController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskService.getTasks(req.userId!, req.query as any);
      res.json(result);
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTaskById(req.params.id, req.userId!);
      res.json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.createTask(req.userId!, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.updateTask(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await taskService.deleteTask(req.params.id, req.userId!);
      res.json({ success: true, message: 'Task deleted' });
    } catch (error) { next(error); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await taskService.getTaskStats(req.userId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }
}

export const taskController = new TaskController();
