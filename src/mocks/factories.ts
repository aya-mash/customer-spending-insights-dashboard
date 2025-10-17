import { seededRandom, pick, randomFloat, randomInt, generateId } from './util';
import type {
  CustomerProfileResponse,
  SpendingSummaryResponse,
  SpendingCategoriesResponse,
  SpendingTrendsResponse,
  TransactionsResponse,
  SpendingGoalsResponse,
  FiltersResponse,
  TransactionItem,
  SpendingCategoryItem,
  SpendingGoalItem,
  MonthlyTrendItem,
} from '../types/api';

const CATEGORY_DEFS = [
  { name: 'Groceries', color: '#FF6B6B', icon: 'shopping-cart' },
  { name: 'Entertainment', color: '#4ECDC4', icon: 'film' },
  { name: 'Transportation', color: '#45B7D1', icon: 'car' },
  { name: 'Dining', color: '#F7DC6F', icon: 'utensils' },
  { name: 'Shopping', color: '#BB8FCE', icon: 'shopping-bag' },
  { name: 'Utilities', color: '#85C1E9', icon: 'zap' },
];

export function makeProfile(customerId: string): CustomerProfileResponse {
  const rnd = seededRandom(hashString(customerId));
  return {
    customerId,
    name: 'John Doe',
    email: 'john.doe@email.com',
    joinDate: '2023-01-15',
    accountType: rnd() > 0.5 ? 'premium' : 'standard',
    totalSpent: randomFloat(10000, 30000, rnd),
    currency: 'ZAR',
  };
}

export function makeSpendingSummary(period: string): SpendingSummaryResponse {
  const seed = hashString(period);
  const rnd = seededRandom(seed);
  const totalSpent = randomFloat(2000, 6000, rnd);
  const transactionCount = randomInt(30, 80, rnd);
  const averageTransaction = Number.parseFloat((totalSpent / transactionCount).toFixed(2));
  const topCategory = pick(CATEGORY_DEFS, rnd).name;
  return {
    period,
    totalSpent,
    transactionCount,
    averageTransaction,
    topCategory,
    comparedToPrevious: {
      spentChange: randomFloat(-15, 25, rnd),
      transactionChange: randomFloat(-10, 10, rnd),
    },
  };
}

export function makeSpendingCategories(period: string, start?: string, end?: string): SpendingCategoriesResponse {
  const seed = hashString(period + (start || '') + (end || ''));
  const rnd = seededRandom(seed);
  const categories: SpendingCategoryItem[] = CATEGORY_DEFS.map(def => {
    const amount = randomFloat(200, 1500, rnd);
    const transactionCount = randomInt(3, 20, rnd);
    return {
      name: def.name,
      amount,
      percentage: 0, // Fill later
      transactionCount,
      color: def.color,
      icon: def.icon,
    };
  });
  const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0);
  for (const c of categories) {
    c.percentage = Number.parseFloat(((c.amount / totalAmount) * 100).toFixed(1));
  }
  return {
    dateRange: {
      startDate: start || '2024-08-16',
      endDate: end || '2024-09-16',
    },
  totalAmount: Number.parseFloat(totalAmount.toFixed(2)),
    categories,
  };
}

export function makeSpendingTrends(months: number): SpendingTrendsResponse {
  const now = new Date();
  const rnd = seededRandom(months * 999);
  const trends: MonthlyTrendItem[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const totalSpent = randomFloat(3000, 5000, rnd);
    const transactionCount = randomInt(30, 60, rnd);
  const averageTransaction = Number.parseFloat((totalSpent / transactionCount).toFixed(2));
    trends.push({ month, totalSpent, transactionCount, averageTransaction });
  }
  return { trends };
}

export function makeTransactions(limit: number, offset: number, category?: string): TransactionsResponse {
  const rnd = seededRandom(limit * 1234 + offset);
  const list: TransactionItem[] = [];
  for (let i = 0; i < limit; i++) {
    const catDef = category ? CATEGORY_DEFS.find(c => c.name === category) || pick(CATEGORY_DEFS, rnd) : pick(CATEGORY_DEFS, rnd);
    const amount = randomFloat(50, 500, rnd);
    const date = new Date(Date.now() - i * 86400000 * rnd()).toISOString();
    list.push({
      id: generateId('txn', rnd),
      date,
      merchant: pick(['Pick n Pay', 'Checkers', 'Netflix', 'Uber', 'Shell', 'Takealot'], rnd),
      category: catDef.name,
      amount,
      description: 'Mock transaction',
      paymentMethod: pick(['Credit Card', 'Debit Order', 'Cash', 'EFT'], rnd),
      icon: catDef.icon,
      categoryColor: catDef.color,
    });
  }
  const total = 1250; // fixed total for consistency
  const hasMore = offset + limit < total;
  return {
    transactions: list,
    pagination: { total, limit, offset, hasMore },
  };
}

export function makeGoals(): SpendingGoalsResponse {
  const rnd = seededRandom(777);
  const goals: SpendingGoalItem[] = CATEGORY_DEFS.slice(0, 2).map(def => {
    const monthlyBudget = randomFloat(800, 2000, rnd);
    const currentSpent = randomFloat(0.4 * monthlyBudget, 1.1 * monthlyBudget, rnd);
  const percentageUsed = Number.parseFloat(((currentSpent / monthlyBudget) * 100).toFixed(2));
    let status: SpendingGoalItem['status'] = 'on_track';
    if (percentageUsed > 90 && percentageUsed <= 105) status = 'warning';
    else if (percentageUsed > 105) status = 'over';
    return {
      id: generateId('goal', rnd),
      category: def.name,
      monthlyBudget,
      currentSpent,
      percentageUsed,
      daysRemaining: randomInt(0, 25, rnd),
      status,
    };
  });
  return { goals };
}

export function makeFilters(): FiltersResponse {
  return {
    categories: CATEGORY_DEFS.map(c => ({ name: c.name, color: c.color, icon: c.icon })),
    dateRangePresets: [
      { label: 'Last 7 days', value: '7d' },
      { label: 'Last 30 days', value: '30d' },
      { label: 'Last 90 days', value: '90d' },
      { label: 'Last year', value: '1y' },
    ],
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const codePoint = str.codePointAt(i) ?? 0;
    hash = (hash << 5) - hash + codePoint;
    hash = Math.trunc(hash); // Convert to 32bit integer
  }
  return Math.abs(hash);
}