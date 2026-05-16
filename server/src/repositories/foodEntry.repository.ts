import { FoodEntry } from '@aarvieve/shared';
import { BaseRepository } from './base.repository';

export class FoodEntryRepository extends BaseRepository<FoodEntry> {
  constructor() {
    super('foodEntries');
  }

  async findByDate(userId: string, date: string): Promise<FoodEntry[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodEntry));
    
    data = data.filter((item) => item.date === date);
    data.sort((a: any, b: any) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });

    return data;
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<FoodEntry[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodEntry));

    data = data.filter((item) => item.date >= startDate && item.date <= endDate);
    data.sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

    return data;
  }
}

export const foodEntryRepository = new FoodEntryRepository();
