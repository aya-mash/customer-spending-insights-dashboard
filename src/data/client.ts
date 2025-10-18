import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  Profile,
  SpendingSummary,
  CategoryBreakdown,
  SpendingTrends,
  TransactionsPage,
  GoalsResponse,
  FiltersResponse,
  PeriodPreset,
  CategoriesParams,
  TransactionsParams,
  TrendsParams,
} from './models';

// Base URL: same-origin relative by default; can be overridden via VITE_API_BASE.
// Example: VITE_API_BASE=http://localhost:3000/api/customers
const baseURL = (import.meta as unknown as { env: Record<string,string|undefined> }).env.VITE_API_BASE || '/api/customers';

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
});

// Dev-only logging interceptor.
if (import.meta.env.DEV) {
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      console.debug('[api]', res.config.method?.toUpperCase(), res.config.url, res.status);
      return res;
    },
    (err: unknown) => {
      if (err instanceof Error) console.warn('[api error]', err.message);
      return Promise.reject(err instanceof Error ? err : new Error('Request failed'));
    },
  );
}

interface NormalizedError extends Error { status?: number }
function normalizeError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    const ae = error as AxiosError<unknown>;
    const status = ae.response?.status;
    const data: unknown = ae.response?.data;
    const message = typeof (data as { message?: unknown })?.message === 'string'
      ? (data as { message?: string }).message
      : ae.message || 'Request failed';
    const e: NormalizedError = new Error(message);
    if (typeof status === 'number') e.status = status;
    return e;
  }
  return error instanceof Error ? error : new Error('Unknown error');
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    usp.append(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}

// Generic GET with cancellation support.
async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const res = await instance.get<T>(url, { signal });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export function profile(customerId: string, signal?: AbortSignal): Promise<Profile> {
  return get<Profile>(`/${encodeURIComponent(customerId)}/profile`, signal);
}

export function spendingSummary(customerId: string, period: PeriodPreset = '30d', signal?: AbortSignal): Promise<SpendingSummary> {
  return get<SpendingSummary>(`/${encodeURIComponent(customerId)}/spending/summary${buildQuery({ period })}`, signal);
}

export function categories(customerId: string, params: CategoriesParams = {}, signal?: AbortSignal): Promise<CategoryBreakdown> {
  const { period = '30d', startDate, endDate } = params;
  return get<CategoryBreakdown>(`/${encodeURIComponent(customerId)}/spending/categories${buildQuery({ period, startDate, endDate })}`, signal);
}

export function trends(customerId: string, params: TrendsParams = {}, signal?: AbortSignal): Promise<SpendingTrends> {
  const { months = 12 } = params;
  return get<SpendingTrends>(`/${encodeURIComponent(customerId)}/spending/trends${buildQuery({ months })}`, signal);
}

export function transactions(customerId: string, params: TransactionsParams = {}, signal?: AbortSignal): Promise<TransactionsPage> {
  const { limit = 20, offset = 0, category, startDate, endDate, sortBy = 'date_desc' } = params;
  return get<TransactionsPage>(`/${encodeURIComponent(customerId)}/transactions${buildQuery({ limit, offset, category, startDate, endDate, sortBy })}`, signal);
}

export function goals(customerId: string, signal?: AbortSignal): Promise<GoalsResponse> {
  return get<GoalsResponse>(`/${encodeURIComponent(customerId)}/goals`, signal);
}

export function filters(customerId: string, signal?: AbortSignal): Promise<FiltersResponse> {
  return get<FiltersResponse>(`/${encodeURIComponent(customerId)}/filters`, signal);
}

// Re-export unions if needed externally via models.ts
