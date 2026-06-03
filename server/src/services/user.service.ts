import { User } from '@aarvieve/shared';
import { userRepository } from '../repositories';
import { auth } from '../firebase';

export class UserService {
  async getOrCreateUser(uid: string, email: string, displayName: string, currency?: string): Promise<User> {
    let user = await userRepository.findById(uid);
    if (!user) {
      const now = new Date().toISOString();
      user = await userRepository.create({
        uid, email, displayName,
        createdAt: now, updatedAt: now,
        preferences: { theme: 'dark', currency: currency || 'PHP', timezone: 'UTC', dailyCalorieGoal: 2000, weeklyBudget: 500 },
      });
    } else {
      // If the user was created by onAuthStateChanged before updateProfile finished,
      // the displayName could be null or 'User' (placeholder). Update it now with real values.
      const needsNameUpdate = displayName && displayName !== 'User' && (!user.displayName || user.displayName === 'User');
      const needsCurrencyUpdate = currency && user.preferences?.currency === 'USD';
      if (needsNameUpdate || needsCurrencyUpdate) {
        const patch: Partial<User> = {};
        if (needsNameUpdate) patch.displayName = displayName;
        if (needsCurrencyUpdate) patch.preferences = { ...user.preferences, currency };
        user = await userRepository.update(uid, patch);
      }
    }
    return user;
  }

  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    return userRepository.update(uid, data);
  }

  async getUser(uid: string): Promise<User | null> {
    return userRepository.findById(uid);
  }

  async deleteUser(uid: string): Promise<void> {
    // Delete from Firebase Auth
    try {
      await auth.deleteUser(uid);
    } catch (e: any) {
      if (e.code !== 'auth/user-not-found') throw e;
    }
    // Delete from database
    await userRepository.delete(uid);
  }
}

export const userService = new UserService();
