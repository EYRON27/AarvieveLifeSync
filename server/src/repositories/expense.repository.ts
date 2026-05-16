import { Expense } from '@aarvieve/shared';
import { BaseRepository } from './base.repository';

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expenses');
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<Expense[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense));

    // Filter by date range in memory
    data = data.filter((item) => item.date >= startDate && item.date <= endDate);

    // Sort by date descending
    data.sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

    return data;
  }

  async getTotalByCategory(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    const expenses = await this.findByDateRange(userId, startDate, endDate);
    const totals: Record<string, number> = {};

    for (const expense of expenses) {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    }

    return totals;
  }
}

export const expenseRepository = new ExpenseRepository();
