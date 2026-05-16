import { DashboardStats, RecentActivity } from '@aarvieve/shared';
import { taskService } from './task.service';
import { expenseService } from './expense.service';
import { timeEntryService } from './timeEntry.service';
import { foodEntryService } from './foodEntry.service';
import { passwordRepository, taskRepository, expenseRepository, timeEntryRepository, foodEntryRepository } from '../repositories';

export class DashboardService {
  async getStats(userId: string): Promise<DashboardStats> {
    const today = new Date().toISOString().split('T')[0];

    const taskStats = await taskService.getTaskStats(userId);
    const expenseSummary = await expenseService.getSummary(userId);
    const timeSummary = await timeEntryService.getWeeklySummary(userId);
    const runningTimer = await timeEntryService.getRunningTimer(userId);
    const foodSummary = await foodEntryService.getDailySummary(userId, today);
    const { total: passwordTotal } = await passwordRepository.findByUserId(userId, { limit: 1 });

    let topCategory = 'None';
    let maxAmt = 0;
    for (const [cat, amt] of Object.entries(expenseSummary.byCategory)) {
      if (amt > maxAmt) { maxAmt = amt; topCategory = cat; }
    }

    let topProject = 'None';
    let maxH = 0;
    for (const [proj, h] of Object.entries(timeSummary.byProject)) {
      if (h > maxH) { maxH = h; topProject = proj; }
    }

    return {
      tasks: { total: taskStats.total, completed: taskStats.completed, overdue: taskStats.overdue, inProgress: taskStats.inProgress },
      expenses: { monthTotal: expenseSummary.totalExpenses, weekTotal: 0, todayTotal: 0, topCategory },
      timeTracker: { todayHours: 0, weekHours: timeSummary.totalHours, activeTimer: !!runningTimer, topProject },
      foodTracker: { todayCalories: foodSummary.totalCalories, calorieGoal: 2000, todayMeals: Object.values(foodSummary.byMealType).reduce((s, m) => s + m.count, 0) },
      passwords: { totalEntries: passwordTotal },
    };
  }

  async getRecentActivity(userId: string): Promise<RecentActivity[]> {
    const [tasks, expenses, timeEntries, foodEntries] = await Promise.all([
      taskRepository.findRecentByUserId(userId, 3),
      expenseRepository.findRecentByUserId(userId, 3),
      timeEntryRepository.findRecentByUserId(userId, 3),
      foodEntryRepository.findRecentByUserId(userId, 3),
    ]);

    const activities: RecentActivity[] = [
      ...tasks.map((t) => ({ id: t.id, type: 'task' as const, action: 'created' as const, title: t.title, timestamp: t.createdAt })),
      ...expenses.map((e) => ({ id: e.id, type: 'expense' as const, action: 'created' as const, title: `${e.title} - $${e.amount}`, timestamp: e.createdAt })),
      ...timeEntries.map((t) => ({ id: t.id, type: 'time' as const, action: 'created' as const, title: `${t.title}`, timestamp: t.createdAt })),
      ...foodEntries.map((f) => ({ id: f.id, type: 'food' as const, action: 'created' as const, title: `${f.name} - ${f.calories} cal`, timestamp: f.createdAt })),
    ];

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
  }
}

export const dashboardService = new DashboardService();
