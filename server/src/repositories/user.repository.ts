import { User } from '@aarvieve/shared';
import { db } from '../firebase';
import { NotFoundError } from '../utils/errors';

const COLLECTION = 'users';

export class UserRepository {
  private get collection() {
    return db.collection(COLLECTION);
  }

  async findById(uid: string): Promise<User | null> {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as User;
  }

  async create(user: User): Promise<User> {
    await this.collection.doc(user.uid).set(user);
    return user;
  }

  async update(uid: string, data: Partial<User>): Promise<User> {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) {
      throw new NotFoundError('User');
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await this.collection.doc(uid).update(updateData);
    const updated = await this.collection.doc(uid).get();
    return { uid: updated.id, ...updated.data() } as User;
  }
  async delete(uid: string): Promise<void> {
    await this.collection.doc(uid).delete();
  }
}

export const userRepository = new UserRepository();
