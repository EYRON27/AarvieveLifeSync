import {
  TimeEntry,
  CreateTimeEntryDTO,
  UpdateTimeEntryDTO,
  TimeFilters,
  PaginatedResponse,
  TimeSummary,
} from '@aarvieve/shared';
import { timeEntryRepository } from '../repositories';

export class TimeEntryService {
  async getTimeEntries(userId: string, filters: TimeFilters): Promise<PaginatedResponse<TimeEntry>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const queryFilters: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];

    if (filters.project) {
      queryFilters.push({ field: 'project', operator: '==', value: filters.project });
    }
    if (filters.isRunning !== undefined) {
      queryFilters.push({ field: 'isRunning', operator: '==', value: filters.isRunning });
    }

    const { data, total } = await timeEntryRepository.findByUserId(userId, {
      orderBy: filters.sortBy || 'startTime',
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

  async startTimer(userId: string, data: CreateTimeEntryDTO): Promise<TimeEntry> {
    // Stop any existing running timer
    const running = await timeEntryRepository.findRunning(userId);
    if (running) {
      await this.stopTimer(running.id, userId);
    }

    const entryData = {
      userId,
      title: data.title,
      description: data.description || '',
      project: data.project || 'General',
      startTime: data.startTime || new Date().toISOString(),
      endTime: null,
      duration: 0,
      isRunning: true,
      tags: data.tags || [],
    } as Omit<TimeEntry, 'id'>;

    return timeEntryRepository.create(entryData);
  }

  async stopTimer(id: string, userId: string): Promise<TimeEntry> {
    const entry = await timeEntryRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');

    const endTime = new Date();
    const startTime = new Date(entry.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    return timeEntryRepository.update(id, {
      endTime: endTime.toISOString(),
      duration,
      isRunning: false,
    } as Partial<TimeEntry>);
  }

  async createManualEntry(userId: string, data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const startTime = data.startTime ? new Date(data.startTime) : new Date();
    const endTime = data.endTime ? new Date(data.endTime) : new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const entryData = {
      userId,
      title: data.title,
      description: data.description || '',
      project: data.project || 'General',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: Math.max(0, duration),
      isRunning: false,
      tags: data.tags || [],
    } as Omit<TimeEntry, 'id'>;

    return timeEntryRepository.create(entryData);
  }

  async deleteEntry(id: string, userId: string): Promise<void> {
    const entry = await timeEntryRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');
    await timeEntryRepository.delete(id);
  }

  async getRunningTimer(userId: string): Promise<TimeEntry | null> {
    return timeEntryRepository.findRunning(userId);
  }

  async getWeeklySummary(userId: string): Promise<TimeSummary> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const entries = await timeEntryRepository.findByDateRange(
      userId,
      startOfWeek.toISOString(),
      now.toISOString()
    );

    const totalSeconds = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const totalHours = totalSeconds / 3600;

    const byProject: Record<string, number> = {};
    for (const entry of entries) {
      const project = entry.project || 'General';
      byProject[project] = (byProject[project] || 0) + (entry.duration || 0) / 3600;
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyTrend = days.map((day, idx) => {
      const dayEntries = entries.filter((e) => new Date(e.startTime).getDay() === idx);
      const hours = dayEntries.reduce((sum, e) => sum + (e.duration || 0), 0) / 3600;
      return { day, hours: Math.round(hours * 100) / 100 };
    });

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      byProject,
      weeklyTrend,
      averageDaily: Math.round((totalHours / 7) * 100) / 100,
    };
  }
}

export const timeEntryService = new TimeEntryService();
