import {
  FoodEntry,
  CreateFoodEntryDTO,
  UpdateFoodEntryDTO,
  FoodFilters,
  PaginatedResponse,
  FoodSummary,
  MealType,
} from '@aarvieve/shared';
import { foodEntryRepository } from '../repositories';

export class FoodEntryService {
  async getFoodEntries(userId: string, filters: FoodFilters): Promise<PaginatedResponse<FoodEntry>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const queryFilters: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];

    if (filters.mealType) {
      queryFilters.push({ field: 'mealType', operator: '==', value: filters.mealType });
    }

    const { data, total } = await foodEntryRepository.findByUserId(userId, {
      orderBy: filters.sortBy || 'date',
      orderDirection: filters.sortOrder || 'desc',
      limit,
      offset,
      filters: queryFilters,
    });

    return {
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createFoodEntry(userId: string, data: CreateFoodEntryDTO): Promise<FoodEntry> {
    const entryData = {
      ...data,
      userId,
      protein: data.protein || 0,
      carbs: data.carbs || 0,
      fat: data.fat || 0,
      notes: data.notes || '',
    } as Omit<FoodEntry, 'id'>;

    return foodEntryRepository.create(entryData);
  }

  async updateFoodEntry(id: string, userId: string, data: UpdateFoodEntryDTO): Promise<FoodEntry> {
    const entry = await foodEntryRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');
    return foodEntryRepository.update(id, data as Partial<FoodEntry>);
  }

  async deleteFoodEntry(id: string, userId: string): Promise<void> {
    const entry = await foodEntryRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');
    await foodEntryRepository.delete(id);
  }

  async getDailySummary(userId: string, date: string): Promise<FoodSummary> {
    const entries = await foodEntryRepository.findByDate(userId, date);

    const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
    const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
    const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
    const totalFat = entries.reduce((sum, e) => sum + e.fat, 0);

    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
    const byMealType = {} as Record<MealType, { calories: number; count: number }>;

    for (const type of mealTypes) {
      const typeEntries = entries.filter((e) => e.mealType === type);
      byMealType[type] = {
        calories: typeEntries.reduce((sum, e) => sum + e.calories, 0),
        count: typeEntries.length,
      };
    }

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      byMealType,
      dailyTrend: [],
    };
  }
}

export const foodEntryService = new FoodEntryService();
