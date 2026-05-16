import { PasswordEntry } from '@aarvieve/shared';
import { BaseRepository } from './base.repository';

export class PasswordRepository extends BaseRepository<PasswordEntry> {
  constructor() {
    super('passwords');
  }

  async findByCategory(userId: string, category: string): Promise<PasswordEntry[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PasswordEntry));

    data = data.filter((item) => item.category === category);
    data.sort((a: any, b: any) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });

    return data;
  }

  async searchByTitle(userId: string, searchTerm: string): Promise<PasswordEntry[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PasswordEntry));

    // Sort by title
    data.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return data.filter((entry) =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.website.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export const passwordRepository = new PasswordRepository();
