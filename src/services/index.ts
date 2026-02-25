// ─── Services – barrel export ───────────────────────────────────
// Central re-export so consumers can do:
//   import { loginUser, addExpense, applyFilters } from '@/services';
// ────────────────────────────────────────────────────────────────

export {
  loginUser,
  registerUser,
  logoutUser,
  switchUserRole,
  restoreSession,
} from './authService';

export {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
} from './expenseService';

export {
  getBudgets,
  getBudgetById,
  addBudget,
  updateBudget,
  deleteBudget,
} from './budgetService';

export {
  searchByText,
  filterByField,
  filterByFields,
  sortItems,
  presetToDateRange,
  filterByDateRange,
  paginate,
  applyFilters,
} from './filterService';

// Re-export service-specific types for convenience
export type { AuthResult } from './authService';
export type { ServiceResponse, CreateExpenseDTO, UpdateExpenseDTO } from './expenseService';
export type { CreateBudgetDTO, UpdateBudgetDTO } from './budgetService';
export type {
  SortDirection,
  SortConfig,
  DateRangePreset,
  DateRange,
  PaginatedResult,
  FilterPipelineConfig,
  FilterPipelineResult,
} from './filterService';
