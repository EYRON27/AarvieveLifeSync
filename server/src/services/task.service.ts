import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters, PaginatedResponse } from '@aarvieve/shared';
import { taskRepository } from '../repositories';

export class TaskService {
  async getTasks(userId: string, filters: TaskFilters): Promise<PaginatedResponse<Task>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const queryFilters: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];

    if (filters.status) {
      queryFilters.push({ field: 'status', operator: '==', value: filters.status });
    }
    if (filters.priority) {
      queryFilters.push({ field: 'priority', operator: '==', value: filters.priority });
    }

    const { data, total } = await taskRepository.findByUserId(userId, {
      orderBy: filters.sortBy || 'createdAt',
      orderDirection: filters.sortOrder || 'desc',
      limit,
      offset,
      filters: queryFilters,
    });

    // Apply search filter (client-side for Firestore compatibility)
    let filtered = data;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = data.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
    }

    return {
      success: true,
      data: filtered,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (task.userId !== userId) {
      throw new Error('Unauthorized access');
    }
    return task;
  }

  async createTask(userId: string, data: CreateTaskDTO): Promise<Task> {
    const taskData = {
      ...data,
      userId,
      description: data.description || '',
      priority: data.priority || 'medium',
      status: data.status || 'todo',
      dueDate: data.dueDate || null,
      tags: data.tags || [],
    } as Omit<Task, 'id'>;

    return taskRepository.create(taskData);
  }

  async updateTask(id: string, userId: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (task.userId !== userId) {
      throw new Error('Unauthorized access');
    }
    return taskRepository.update(id, data as Partial<Task>);
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(id);
    if (task.userId !== userId) {
      throw new Error('Unauthorized access');
    }
    await taskRepository.delete(id);
  }

  async getTaskStats(userId: string) {
    const counts = await taskRepository.getStatusCounts(userId);
    let overdueCount = 0;
    try {
      const overdue = await taskRepository.findOverdue(userId);
      overdueCount = overdue.length;
    } catch {
      // Firestore composite index may not exist yet
    }

    return {
      total: Object.values(counts).reduce((a, b) => a + b, 0),
      completed: counts['completed'] || 0,
      inProgress: counts['in-progress'] || 0,
      todo: counts['todo'] || 0,
      overdue: overdueCount,
    };
  }
}

export const taskService = new TaskService();
