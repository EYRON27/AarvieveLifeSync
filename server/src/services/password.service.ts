import {
  PasswordEntry,
  CreatePasswordDTO,
  UpdatePasswordDTO,
  DecryptedPasswordEntry,
  PaginationParams,
  PaginatedResponse,
} from '@aarvieve/shared';
import { passwordRepository } from '../repositories';
import { encrypt, decrypt } from '../utils/encryption';

export class PasswordService {
  async getPasswords(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedResponse<Omit<PasswordEntry, 'encryptedPassword'>>> {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const offset = (page - 1) * limit;

    const { data, total } = await passwordRepository.findByUserId(userId, {
      orderBy: params.sortBy || 'createdAt',
      orderDirection: params.sortOrder || 'desc',
      limit,
      offset,
    });

    // Strip encrypted passwords from listing
    const safeData = data.map(({ encryptedPassword, ...rest }) => rest);

    let filtered = safeData;
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = safeData.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.website.toLowerCase().includes(search) ||
          p.username.toLowerCase().includes(search)
      );
    }

    return {
      success: true,
      data: filtered as any,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getDecryptedPassword(id: string, userId: string): Promise<DecryptedPasswordEntry> {
    const entry = await passwordRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');

    const decryptedPassword = decrypt(entry.encryptedPassword);
    const { encryptedPassword, ...rest } = entry;

    return { ...rest, password: decryptedPassword };
  }

  async createPassword(userId: string, data: CreatePasswordDTO): Promise<PasswordEntry> {
    const encryptedPassword = encrypt(data.password);

    const entryData = {
      userId,
      title: data.title,
      username: data.username,
      encryptedPassword,
      website: data.website || '',
      category: data.category || 'other',
      notes: data.notes || '',
    } as Omit<PasswordEntry, 'id'>;

    return passwordRepository.create(entryData);
  }

  async updatePassword(id: string, userId: string, data: UpdatePasswordDTO): Promise<PasswordEntry> {
    const entry = await passwordRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');

    const updateData: Partial<PasswordEntry> = { ...data } as any;

    if (data.password) {
      updateData.encryptedPassword = encrypt(data.password);
      delete (updateData as any).password;
    }

    return passwordRepository.update(id, updateData);
  }

  async deletePassword(id: string, userId: string): Promise<void> {
    const entry = await passwordRepository.findById(id);
    if (entry.userId !== userId) throw new Error('Unauthorized');
    await passwordRepository.delete(id);
  }
}

export const passwordService = new PasswordService();
