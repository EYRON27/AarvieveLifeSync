// ============================================================
// User Types
// ============================================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  timezone: string;
  dailyCalorieGoal: number;
  weeklyBudget: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  displayName: string;
}

// ============================================================
// Task Types
// ============================================================

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  tags?: string[];
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {}

// ============================================================
// Expense Types
// ============================================================

export type ExpenseCategory = string;

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDTO {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {}

export interface ExpenseSummary {
  totalExpenses: number;
  byCategory: Record<ExpenseCategory, number>;
  monthlyTrend: { month: string; total: number }[];
  averageDaily: number;
}

// ============================================================
// Password Vault Types
// ============================================================

export type VaultCategory =
  | 'social'
  | 'email'
  | 'banking'
  | 'work'
  | 'entertainment'
  | 'shopping'
  | 'development'
  | 'other';

export interface PasswordEntry {
  id: string;
  userId: string;
  title: string;
  username: string;
  encryptedPassword: string; // AES encrypted
  website: string;
  category: VaultCategory;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePasswordDTO {
  title: string;
  username: string;
  password: string; // Raw — will be encrypted on server
  website?: string;
  category?: VaultCategory;
  notes?: string;
}

export interface UpdatePasswordDTO extends Partial<CreatePasswordDTO> {}

export interface DecryptedPasswordEntry extends Omit<PasswordEntry, 'encryptedPassword'> {
  password: string;
}

// ============================================================
// Time Tracker Types
// ============================================================

export interface TimeEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  project: string;
  startTime: string;
  endTime: string | null;
  duration: number; // in seconds
  isRunning: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeEntryDTO {
  title: string;
  description?: string;
  project?: string;
  startTime?: string;
  endTime?: string;
  tags?: string[];
}

export interface UpdateTimeEntryDTO extends Partial<CreateTimeEntryDTO> {
  isRunning?: boolean;
}

export interface TimeSummary {
  totalHours: number;
  byProject: Record<string, number>;
  weeklyTrend: { day: string; hours: number }[];
  averageDaily: number;
}

// ============================================================
// Food Tracker Types
// ============================================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodEntryDTO {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType: MealType;
  date: string;
  notes?: string;
}

export interface UpdateFoodEntryDTO extends Partial<CreateFoodEntryDTO> {}

export interface FoodSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  byMealType: Record<MealType, { calories: number; count: number }>;
  dailyTrend: { date: string; calories: number }[];
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardStats {
  tasks: {
    total: number;
    completed: number;
    overdue: number;
    inProgress: number;
  };
  expenses: {
    monthTotal: number;
    weekTotal: number;
    todayTotal: number;
    topCategory: string;
  };
  timeTracker: {
    todayHours: number;
    weekHours: number;
    activeTimer: boolean;
    topProject: string;
  };
  foodTracker: {
    todayCalories: number;
    calorieGoal: number;
    todayMeals: number;
  };
  passwords: {
    totalEntries: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'task' | 'expense' | 'time' | 'food' | 'password';
  action: 'created' | 'updated' | 'completed' | 'deleted';
  title: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ============================================================
// API Types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface TaskFilters extends PaginationParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface ExpenseFilters extends PaginationParams {
  category?: ExpenseCategory;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TimeFilters extends PaginationParams {
  project?: string;
  dateFrom?: string;
  dateTo?: string;
  isRunning?: boolean;
}

export interface FoodFilters extends PaginationParams {
  mealType?: MealType;
  dateFrom?: string;
  dateTo?: string;
}
