// Shared API response types for mock endpoints.

export interface CustomerProfileResponse {
  customerId: string;
  name: string;
  email: string;
  joinDate: string; // ISO date
  accountType: 'standard' | 'premium';
  totalSpent: number;
  currency: 'ZAR';
}

export interface SpendingSummaryResponse {
  period: string; // 7d | 30d | 90d | 1y
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: {
    spentChange: number; // percentage
    transactionChange: number; // percentage
  };
}

export interface SpendingCategoryItem {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}

export interface SpendingCategoriesResponse {
  dateRange: { startDate: string; endDate: string };
  totalAmount: number;
  categories: SpendingCategoryItem[];
}

export interface MonthlyTrendItem {
  month: string; // YYYY-MM
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface SpendingTrendsResponse {
  trends: MonthlyTrendItem[];
}

export interface TransactionItem {
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

export interface TransactionsResponse {
  transactions: TransactionItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SpendingGoalItem {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: 'on_track' | 'warning' | 'over';
}

export interface SpendingGoalsResponse {
  goals: SpendingGoalItem[];
}

export interface FiltersResponse {
  categories: Array<{ name: string; color: string; icon: string }>;
  dateRangePresets: Array<{ label: string; value: string }>;
}