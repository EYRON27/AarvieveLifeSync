import { TimeEntry } from '@aarvieve/shared';
import { BaseRepository } from './base.repository';

export class TimeEntryRepository extends BaseRepository<TimeEntry> {
  constructor() {
    super('timeEntries');
  }

  async findRunning(userId: string): Promise<TimeEntry | null> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('isRunning', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as TimeEntry;
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TimeEntry));

    // Filter and sort in memory
    data = data.filter((item) => item.startTime && item.startTime >= startDate && item.startTime <= endDate);
    data.sort((a, b) => {
      const timeA = a.startTime || '';
      const timeB = b.startTime || '';
      if (timeA < timeB) return 1;
      if (timeA > timeB) return -1;
      return 0;
    });

    return data;
  }
}

export const timeEntryRepository = new TimeEntryRepository();
