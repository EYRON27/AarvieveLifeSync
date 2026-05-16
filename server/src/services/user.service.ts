import { User } from '@aarvieve/shared';
import { userRepository } from '../repositories';
import { auth } from '../firebase';

export class UserService {
  async getOrCreateUser(uid: string, email: string, displayName: string): Promise<User> {
    let user = await userRepository.findById(uid);
    if (!user) {
      const now = new Date().toISOString();
      user = await userRepository.create({
        uid, email, displayName,
        createdAt: now, updatedAt: now,
        preferences: { theme: 'dark', currency: 'USD', timezone: 'UTC', dailyCalorieGoal: 2000, weeklyBudget: 500 },
      });
    }
    return user;
  }

  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    return userRepository.update(uid, data);
  }

  async getUser(uid: string): Promise<User | null> {
    return userRepository.findById(uid);
  }
}

export const userService = new UserService();
