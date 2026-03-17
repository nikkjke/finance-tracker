// ─── filterService.ts ───────────────────────────────────────────
// Generic filtering, sorting, date-range & pagination utilities.
// Designed for reuse across AdminUsers, AdminTransactions,
// ReportsPage, BudgetsPage, etc.
// ────────────────────────────────────────────────────────────────

// ─── Types ──────────────────────────────────────────────────────

/** Direction used by the sorter. */
export type SortDirection = 'asc' | 'desc';

/** Describes how to sort a list of items. */
export interface SortConfig<T> {
  /** The object key to sort by. */
  key: keyof T;
  /** Sort direction – defaults to 'asc' when omitted. */
  direction?: SortDirection;
}

/** Represents a named date range for convenience helpers. */
export type DateRangePreset = '7days' | '30days' | '6months' | '1year' | 'week' | 'month' | 'quarter' | 'year';

/** Explicit start / end date range. */
export interface DateRange {
  start: Date;
  end: Date;
}

/** The result returned by `paginate()`. */
export interface PaginatedResult<T> {
  /** Items for the current page. */
  items: T[];
  /** Current page number (1-based). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total items across all pages. */
  totalItems: number;
  /** Total number of pages. */
  totalPages: number;
  /** Whether there is a next / previous page. */
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Configuration object accepted by the all-in-one `applyFilters` pipeline. */
export interface FilterPipelineConfig<T> {
  /** Free-text query matched against the specified `searchFields`. */
  searchQuery?: string;
  /** Object keys of `T` whose string values are searched. */
  searchFields?: (keyof T)[];
  /** Key–value filters. A value of `'all'` means "no filter". */
  filters?: Partial<Record<keyof T, string>>;
  /** Sorting configuration. */
  sort?: SortConfig<T>;
  /** Optional date-range filtering. */
  dateField?: keyof T;
  dateRange?: DateRange;
  /** Pagination (1-based page). */
  page?: number;
  pageSize?: number;
}

/** The result returned by `applyFilters`. */
export interface FilterPipelineResult<T> {
  /** Items after filtering, sorting (optionally paginated). */
  items: T[];
  /** Total items *before* pagination (after filter + sort). */
  totalItems: number;
  /** Pagination metadata (only present when `page` & `pageSize` given). */
  pagination?: PaginatedResult<T>;
}

// ─── Core utilities ─────────────────────────────────────────────

/**
 * Case-insensitive text search across one or more fields.
 *
 * @example
 * ```ts
 * searchByText(users, 'mari', ['name', 'email']);
 * ```
 */
export function searchByText<T>(
  items: T[],
  query: string,
  fields: (keyof T)[],
): T[] {
  if (!query.trim()) return items;

  const lower = query.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(lower);
    }),
  );
}

/**
 * Filter items by exact match on a single field.
 * Passing `'all'` as the `value` returns all items (no-op filter).
 *
 * @example
 * ```ts
 * filterByField(users, 'role', 'admin');   // only admins
 * filterByField(users, 'role', 'all');     // everyone
 * ```
 */
export function filterByField<T>(
  items: T[],
  field: keyof T,
  value: string,
): T[] {
  if (value === 'all') return items;
  return items.filter((item) => String(item[field]) === value);
}

/**
 * Apply multiple field-level filters at once.
 * Each entry with value `'all'` is skipped.
 *
 * @example
 * ```ts
 * filterByFields(expenses, { status: 'completed', category: 'all' });
 * ```
 */
export function filterByFields<T>(
  items: T[],
  filters: Partial<Record<keyof T, string>>,
): T[] {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value !== undefined && value !== 'all',
  ) as [keyof T, string][];

  if (activeFilters.length === 0) return items;

  return items.filter((item) =>
    activeFilters.every(([key, value]) => String(item[key]) === value),
  );
}

/**
 * Sort items by a given key.
 * Handles strings (locale-aware), numbers, and date strings.
 *
 * @example
 * ```ts
 * sortItems(users, { key: 'name', direction: 'asc' });
 * sortItems(expenses, { key: 'date', direction: 'desc' });
 * ```
 */
export function sortItems<T>(
  items: T[],
  config: SortConfig<T>,
): T[] {
  const { key, direction = 'asc' } = config;
  const modifier = direction === 'asc' ? 1 : -1;

  return [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    // Nulls last
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * modifier;
    }

    // Try date parsing (ISO date strings)
    const aDate = Date.parse(String(aVal));
    const bDate = Date.parse(String(bVal));
    if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
      return (aDate - bDate) * modifier;
    }

    // Fallback to string comparison
    return String(aVal).localeCompare(String(bVal)) * modifier;
  });
}

// ─── Date-range helpers ─────────────────────────────────────────

/**
 * Convert a named preset into an explicit `{ start, end }` range.
 */
export function presetToDateRange(preset: DateRangePreset): DateRange {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  let start: Date;

  switch (preset) {
    case '7days':
    case 'week':
      start = new Date(end);
      start.setDate(start.getDate() - 7);
      break;
    case '30days':
    case 'month':
      start = new Date(end);
      start.setMonth(start.getMonth() - 1);
      break;
    case '6months':
    case 'quarter':
      start = new Date(end);
      start.setMonth(start.getMonth() - 6);
      break;
    case '1year':
    case 'year':
      start = new Date(end);
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start = new Date(0); // epoch – include everything
  }

  start.setHours(0, 0, 0, 0);
  return { start, end };
}

/**
 * Filter items whose `dateField` falls within the supplied range.
 *
 * @example
 * ```ts
 * filterByDateRange(expenses, 'date', presetToDateRange('30days'));
 * ```
 */
export function filterByDateRange<T>(
  items: T[],
  dateField: keyof T,
  range: DateRange,
): T[] {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();

  return items.filter((item) => {
    const raw = item[dateField];
    if (raw == null) return false;
    const ms = typeof raw === 'number' ? raw : Date.parse(String(raw));
    if (Number.isNaN(ms)) return false;
    return ms >= startMs && ms <= endMs;
  });
}

// ─── Pagination ─────────────────────────────────────────────────

/**
 * Paginate an array of items.
 *
 * @param items  The full (already filtered/sorted) array.
 * @param page   1-based page number.
 * @param pageSize  Number of items per page (default 10).
 *
 * @example
 * ```ts
 * const result = paginate(filteredUsers, 1, 10);
 * // result.items  → first 10 items
 * // result.totalPages → number of pages
 * ```
 */
export function paginate<T>(items: T[], page = 1, pageSize = 10): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));

  const startIdx = (safePage - 1) * pageSize;
  const paginatedItems = items.slice(startIdx, startIdx + pageSize);

  return {
    items: paginatedItems,
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

// ─── All-in-one pipeline ────────────────────────────────────────

/**
 * Combine search, field filters, date-range, sorting and pagination
 * in a single call. Each step is optional.
 *
 * @example
 * ```ts
 * const result = applyFilters(mockExpenses, {
 *   searchQuery: 'Coffee',
 *   searchFields: ['storeName', 'notes'],
 *   filters: { status: 'completed', category: 'food' },
 *   sort: { key: 'date', direction: 'desc' },
 *   dateField: 'date',
 *   dateRange: presetToDateRange('30days'),
 *   page: 1,
 *   pageSize: 10,
 * });
 * ```
 */
export function applyFilters<T>(
  items: T[],
  config: FilterPipelineConfig<T>,
): FilterPipelineResult<T> {
  let result = [...items];

  // 1. Text search
  if (config.searchQuery && config.searchFields?.length) {
    result = searchByText(result, config.searchQuery, config.searchFields);
  }

  // 2. Field filters
  if (config.filters) {
    result = filterByFields(result, config.filters);
  }

  // 3. Date range
  if (config.dateField && config.dateRange) {
    result = filterByDateRange(result, config.dateField, config.dateRange);
  }

  // 4. Sort
  if (config.sort) {
    result = sortItems(result, config.sort);
  }

  const totalItems = result.length;

  // 5. Pagination (optional)
  if (config.page != null && config.pageSize != null) {
    const paginationResult = paginate(result, config.page, config.pageSize);
    return {
      items: paginationResult.items,
      totalItems,
      pagination: paginationResult,
    };
  }

  return { items: result, totalItems };
}
