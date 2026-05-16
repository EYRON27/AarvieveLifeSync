import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import expenseRoutes from './expense.routes';
import passwordRoutes from './password.routes';
import timeRoutes from './time.routes';
import foodRoutes from './food.routes';
import dashboardRoutes from './dashboard.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/expenses', expenseRoutes);
router.use('/passwords', passwordRoutes);
router.use('/time', timeRoutes);
router.use('/food', foodRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

export default router;
