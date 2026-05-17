import { z } from 'zod';

// Helper: reject future dates (allows today)
const noFutureDate = (val: string, ctx: z.RefinementCtx) => {
  const input = new Date(val);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  if (input >= tomorrow) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Date cannot be in the future' });
  }
};

// Helper: reject past dates (allows today)
const noPastDate = (val: string, ctx: z.RefinementCtx) => {
  if (!val) return;
  const input = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (input < today) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Date cannot be in the past' });
  }
};

// ============================================================
// Task Validators
// ============================================================

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().default(''),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  status: z.enum(['todo', 'in-progress', 'completed', 'cancelled']).optional().default('todo'),
  dueDate: z.string().nullable().optional().default(null).superRefine((val, ctx) => { if (val) noPastDate(val, ctx); }),
  tags: z.array(z.string()).optional().default([]),
});

export const updateTaskSchema = createTaskSchema.partial();

// ============================================================
// Expense Validators
// ============================================================

export const createExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  amount: z.number().positive('Amount must be positive'),
  category: z.enum([
    'food',
    'transport',
    'housing',
    'utilities',
    'entertainment',
    'healthcare',
    'education',
    'shopping',
    'personal',
    'other',
  ]),
  date: z.string().min(1, 'Date is required').superRefine(noFutureDate),
  notes: z.string().max(1000).optional().default(''),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// ============================================================
// Password Validators
// ============================================================

export const createPasswordSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  username: z.string().min(1, 'Username is required').max(200),
  password: z.string().min(1, 'Password is required'),
  website: z.string().max(500).optional().default(''),
  category: z
    .enum(['social', 'email', 'banking', 'work', 'entertainment', 'shopping', 'development', 'other'])
    .optional()
    .default('other'),
  notes: z.string().max(1000).optional().default(''),
});

export const updatePasswordSchema = createPasswordSchema.partial();

// ============================================================
// Time Entry Validators
// ============================================================

export const createTimeEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional().default(''),
  project: z.string().max(200).optional().default('General'),
  startTime: z.string().optional().superRefine((val, ctx) => { if (val) noFutureDate(val, ctx); }),
  endTime: z.string().optional().superRefine((val, ctx) => { if (val) noFutureDate(val, ctx); }),
  tags: z.array(z.string()).optional().default([]),
});

export const updateTimeEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  project: z.string().max(200).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isRunning: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================================
// Food Entry Validators
// ============================================================

export const createFoodEntrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  calories: z.number().min(0, 'Calories must be positive'),
  protein: z.number().min(0).optional().default(0),
  carbs: z.number().min(0).optional().default(0),
  fat: z.number().min(0).optional().default(0),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.string().min(1, 'Date is required').superRefine(noFutureDate),
  notes: z.string().max(1000).optional().default(''),
});

export const updateFoodEntrySchema = createFoodEntrySchema.partial();

// ============================================================
// User Validators
// ============================================================

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark']).optional(),
      currency: z.string().max(10).optional(),
      timezone: z.string().max(100).optional(),
      dailyCalorieGoal: z.number().positive().optional(),
      weeklyBudget: z.number().positive().optional(),
    })
    .optional(),
});
