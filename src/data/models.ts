// API contract types (axios client uses these). Formatting of currency is deferred to UI.
export type PeriodPreset = '7d' | '30d' | '90d' | '1y';
export type TransactionSort = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
export type GoalStatus = 'on_track' | 'warning' | 'over';

export interface Profile {
  customerId: string;
  name: string;
  email: string;
  joinDate: string; // YYYY-MM-DD
  accountType: 'standard' | 'premium';
  totalSpent: number;
  currency: 'ZAR';
}

export interface SpendingSummaryCompared { spentChange: number; transactionChange: number; }
export interface SpendingSummary {
  period: PeriodPreset;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: SpendingSummaryCompared;
}

export interface CategoryItem {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}
export interface CategoryBreakdown {
  dateRange: { startDate: string; endDate: string };
  totalAmount: number;
  categories: CategoryItem[];
}

export interface MonthlyTrendPoint {
  month: string; // YYYY-MM
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}
export interface SpendingTrends { trends: MonthlyTrendPoint[]; }

export interface Transaction {
  id: string;
  date: string; // ISO timestamp
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: string;
  categoryColor: string;
}
export interface TransactionsPage {
  transactions: Transaction[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}

export interface GoalItem {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: GoalStatus;
}
export interface GoalsResponse { goals: GoalItem[]; }

export interface FilterCategory { name: string; color: string; icon: string; }
export interface DateRangePreset { label: string; value: PeriodPreset; }
export interface FiltersResponse { categories: FilterCategory[]; dateRangePresets: DateRangePreset[]; }

// Request param helper types
export interface CategoriesParams { period?: PeriodPreset; startDate?: string; endDate?: string; }
export interface TransactionsParams {
  limit?: number; offset?: number; category?: string; startDate?: string; endDate?: string; sortBy?: TransactionSort;
}
export interface TrendsParams { months?: number; }
