/**
 * Gestión financiera HEIR sobre el módulo `finance` de Yggdra
 * (los mismos endpoints que consume frig).
 */
import { apiFetch } from './client';
import type { Paginated } from './types';

export interface Revenue {
  id: string;
  amount?: string | number;
  total_amount?: string | number;
  description?: string;
  status?: string;
  category?: string;
  category_name?: string;
  payment_method?: string;
  date?: string;
  created?: string;
  [key: string]: unknown;
}

export interface RevenueCategory {
  id: string;
  name: string;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface Expense {
  id: string;
  amount?: string | number;
  total_amount?: string | number;
  description?: string;
  status?: string;
  category?: string;
  category_name?: string;
  date?: string;
  created?: string;
  [key: string]: unknown;
}

export interface RevenueSummary {
  total_amount?: string | number;
  received_amount?: string | number;
  pending_amount?: string | number;
  cancelled_amount?: string | number;
  count?: number;
  total?: string | number;
  received?: string | number;
  pending?: string | number;
  [key: string]: unknown;
}

export interface FinancialMetricsSummary {
  total_revenue?: string | number;
  total_expenses?: string | number;
  net_profit?: string | number;
  profit_margin?: string | number;
  current_month_revenue?: string | number;
  current_month_expenses?: string | number;
  current_month_profit?: string | number;
  [key: string]: unknown;
}

export interface RevenuesFilter {
  search?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page_size?: number;
}

function qs(params: Record<string, string | undefined>): string {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) s.set(k, v);
  const q = s.toString();
  return q ? `?${q}` : '';
}

function filterParams(f: RevenuesFilter): Record<string, string | undefined> {
  return {
    search: f.search,
    category: f.category,
    status: f.status,
    start_date: f.startDate,
    end_date: f.endDate,
    page_size: f.page_size ? String(f.page_size) : undefined,
  };
}

export async function fetchRevenues(filter: RevenuesFilter = {}): Promise<Paginated<Revenue>> {
  return apiFetch(`/finance/revenues/${qs(filterParams(filter))}`);
}

export async function fetchRevenueCategories(): Promise<RevenueCategory[]> {
  const data = await apiFetch<Paginated<RevenueCategory>>('/finance/revenue-categories/?page_size=100');
  return data.results ?? [];
}

export async function createRevenue(payload: Partial<Revenue>): Promise<Revenue> {
  return apiFetch('/finance/revenues/', { method: 'POST', body: payload });
}

export async function markRevenueAsReceived(id: string): Promise<Revenue> {
  return apiFetch(`/finance/revenues/${id}/mark_received/`, { method: 'POST' });
}

export async function cancelRevenue(id: string): Promise<Revenue> {
  return apiFetch(`/finance/revenues/${id}/cancel/`, { method: 'POST' });
}

export async function fetchRevenueSummary(filter: RevenuesFilter = {}): Promise<RevenueSummary> {
  return apiFetch(`/finance/revenues/summary/${qs(filterParams(filter))}`);
}

export async function fetchExpenses(filter: RevenuesFilter = {}): Promise<Paginated<Expense>> {
  return apiFetch(`/finance/expenses/${qs(filterParams(filter))}`);
}

export async function createExpense(payload: Partial<Expense>): Promise<Expense> {
  return apiFetch('/finance/expenses/', { method: 'POST', body: payload });
}

/** Métricas planas del dashboard: profitability-reports/summary (no financial-metrics). */
export async function fetchFinancialSummary(): Promise<FinancialMetricsSummary> {
  return apiFetch('/finance/profitability-reports/summary/');
}

export interface RevenueByDateItem {
  date?: string;
  total?: string | number;
  count?: number;
  [key: string]: unknown;
}

export async function fetchRevenuesByDateRange(startDate?: string, endDate?: string): Promise<RevenueByDateItem[]> {
  const data = await apiFetch<{ results?: RevenueByDateItem[] }>(
    `/finance/revenues/by_date_range/${qs({ start_date: startDate, end_date: endDate })}`,
  );
  return data.results ?? [];
}

export function parseAmount(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(String(value)) || 0;
}

export function revenueAmount(r: Revenue | Expense): number {
  return parseAmount(r.total_amount ?? r.amount);
}

export function revenueStatus(r: Revenue): string {
  return String(r.status ?? '').toLowerCase();
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end) };
}
