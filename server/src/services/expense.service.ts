import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseFilters,
  PaginatedResponse,
  ExpenseSummary,
  ExpenseCategory,
} from '@aarvieve/shared';
import { expenseRepository } from '../repositories';

export class ExpenseService {
  async getExpenses(userId: string, filters: ExpenseFilters): Promise<PaginatedResponse<Expense>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const queryFilters: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];

    if (filters.category) {
      queryFilters.push({ field: 'category', operator: '==', value: filters.category });
    }
    if (filters.dateFrom) {
      queryFilters.push({ field: 'date', operator: '>=', value: filters.dateFrom });
    }
    if (filters.dateTo) {
      queryFilters.push({ field: 'date', operator: '<=', value: filters.dateTo });
    }

    const { data, total } = await expenseRepository.findByUserId(userId, {
      orderBy: filters.sortBy || 'date',
      orderDirection: filters.sortOrder || 'desc',
      limit,
      offset,
      filters: queryFilters,
    });

    let filtered = data;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = data.filter((e) => e.title.toLowerCase().includes(search));
    }

    return {
      success: true,
      data: filtered,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createExpense(userId: string, data: CreateExpenseDTO): Promise<Expense> {
    const expenseData = {
      ...data,
      userId,
      notes: data.notes || '',
    } as Omit<Expense, 'id'>;

    return expenseRepository.create(expenseData);
  }

  async updateExpense(id: string, userId: string, data: UpdateExpenseDTO): Promise<Expense> {
    const expense = await expenseRepository.findById(id);
    if (expense.userId !== userId) throw new Error('Unauthorized');
    return expenseRepository.update(id, data as Partial<Expense>);
  }

  async deleteExpense(id: string, userId: string): Promise<void> {
    const expense = await expenseRepository.findById(id);
    if (expense.userId !== userId) throw new Error('Unauthorized');
    await expenseRepository.delete(id);
  }

  async getSummary(userId: string): Promise<ExpenseSummary> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const expenses = await expenseRepository.findByDateRange(userId, startOfMonth, endOfMonth);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = {} as Record<ExpenseCategory, number>;

    const categories = Array.from(new Set(expenses.map(e => e.category)));
    for (const cat of categories) {
      byCategory[cat] = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
    }

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return {
      totalExpenses,
      byCategory,
      monthlyTrend: [],
      averageDaily: totalExpenses / daysInMonth,
    };
  }
}

export const expenseService = new ExpenseService();
