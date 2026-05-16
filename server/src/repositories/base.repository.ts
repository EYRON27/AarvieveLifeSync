import { db } from '../firebase';
import { NotFoundError } from '../utils/errors';

export class BaseRepository<T extends { id: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected get collection() {
    return db.collection(this.collectionName);
  }

  async findById(id: string): Promise<T> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(this.collectionName);
    }
    return { id: doc.id, ...doc.data() } as T;
  }

  async findByUserId(
    userId: string,
    options: {
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
      filters?: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: unknown }>;
    } = {}
  ): Promise<{ data: T[]; total: number }> {
    // Only query by userId to avoid requiring composite indexes
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));

    // Apply filters in memory
    if (options.filters) {
      for (const filter of options.filters) {
        data = data.filter((item: any) => {
          const val = item[filter.field];
          switch (filter.operator) {
            case '==': return val === filter.value;
            case '>=': return val >= (filter.value as any);
            case '<=': return val <= (filter.value as any);
            case '>': return val > (filter.value as any);
            case '<': return val < (filter.value as any);
            case '!=': return val !== filter.value;
            default: return true;
          }
        });
      }
    }

    const total = data.length;

    // Apply ordering in memory
    const orderBy = options.orderBy || 'createdAt';
    const orderDirection = options.orderDirection || 'desc';
    
    data.sort((a: any, b: any) => {
      const valA = a[orderBy];
      const valB = b[orderBy];
      if (valA < valB) return orderDirection === 'asc' ? -1 : 1;
      if (valA > valB) return orderDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const offset = options.offset || 0;
    if (options.limit) {
      data = data.slice(offset, offset + options.limit);
    } else if (offset > 0) {
      data = data.slice(offset);
    }

    return { data, total };
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const now = new Date().toISOString();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await this.collection.add(docData);
    return { id: docRef.id, ...docData } as unknown as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(this.collectionName);
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await this.collection.doc(id).update(updateData);
    const updated = await this.collection.doc(id).get();
    return { id: updated.id, ...updated.data() } as T;
  }

  async delete(id: string): Promise<void> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(this.collectionName);
    }
    await this.collection.doc(id).delete();
  }

  async findRecentByUserId(userId: string, limit: number = 5): Promise<T[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
    
    // Sort by createdAt descending
    data.sort((a: any, b: any) => {
      const valA = a.createdAt;
      const valB = b.createdAt;
      if (valA < valB) return 1;
      if (valA > valB) return -1;
      return 0;
    });

    return data.slice(0, limit);
  }
}
