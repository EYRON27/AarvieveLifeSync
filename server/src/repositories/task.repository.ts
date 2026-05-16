import { Task } from '@aarvieve/shared';
import { BaseRepository } from './base.repository';

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('tasks');
  }

  async findOverdue(userId: string): Promise<Task[]> {
    const now = new Date().toISOString();
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));

    return data.filter(
      (task) => 
        (task.status === 'todo' || task.status === 'in-progress') &&
        task.dueDate !== null &&
        task.dueDate !== undefined &&
        task.dueDate < now
    );
  }

  async getStatusCounts(userId: string): Promise<Record<string, number>> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    const tasks = snapshot.docs.map((doc) => doc.data() as Task);
    
    const counts: Record<string, number> = {
      todo: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0,
    };

    for (const task of tasks) {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    }

    return counts;
  }
}

export const taskRepository = new TaskRepository();
