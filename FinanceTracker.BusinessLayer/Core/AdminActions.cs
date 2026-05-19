using System;
using System.Collections.Generic;
using System.Linq;
using FinanceTracker.DataAccess.Context;
using FinanceTracker.Domain.Entities.Content;
using FinanceTracker.Domain.Models.Admin;

namespace FinanceTracker.BusinessLayer.Core
{
    public class AdminActions
    {
        private static string NormalizeKey(string value)
        {
            return value.Trim().ToLowerInvariant();
        }

        private static string NormalizeCode(string value)
        {
            return value.Trim().ToUpperInvariant();
        }

        private static string NormalizeLabel(string value)
        {
            return value.Trim();
        }

        private static string NormalizeColor(string value)
        {
            return value.Trim();
        }

        internal List<UserDetailsDto> GetAllUsersActionExecution()
        {
            using var db = new FinanceTrackerDbContext();
            return db.Users.Select(u => new UserDetailsDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToList();
        }

        internal bool ChangeUserRoleActionExecution(Guid userId, string newRole)
        {
            using var db = new FinanceTrackerDbContext();
            var user = db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return false;

            // Simple validation
            if (newRole != "Admin" && newRole != "User") return false;

            user.Role = newRole;
            db.Users.Update(user);
            db.SaveChanges();
            return true;
        }

        internal bool DeleteUserActionExecution(Guid userId)
        {
            using var db = new FinanceTrackerDbContext();
            var user = db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return false;

            // Delete all associated data
            var expenses = db.Expenses.Where(e => e.UserId == userId).ToList();
            db.Expenses.RemoveRange(expenses);

            var incomes = db.Incomes.Where(i => i.UserId == userId).ToList();
            db.Incomes.RemoveRange(incomes);

            var budgets = db.Budgets.Where(b => b.UserId == userId).ToList();
            db.Budgets.RemoveRange(budgets);

            // Finally, delete the user
            db.Users.Remove(user);
            db.SaveChanges();
            return true;
        }

        internal AdminContentDto GetAdminContentActionExecution()
        {
            using var db = new FinanceTrackerDbContext();

            return new AdminContentDto
            {
                ExpenseCategories = db.ExpenseCategories
                    .OrderBy(c => c.Label)
                    .Select(c => new ContentCategoryDto { Id = c.Id, Key = c.Key, Label = c.Label })
                    .ToList(),
                IncomeCategories = db.IncomeCategories
                    .OrderBy(c => c.Label)
                    .Select(c => new ContentCategoryDto { Id = c.Id, Key = c.Key, Label = c.Label })
                    .ToList(),
                Currencies = db.Currencies
                    .OrderBy(c => c.Code)
                    .Select(c => new CurrencyDto { Id = c.Id, Code = c.Code, Symbol = c.Symbol, Name = c.Name })
                    .ToList(),
                TransactionStatuses = db.TransactionStatuses
                    .OrderBy(s => s.Label)
                    .Select(s => new TransactionStatusDto { Id = s.Id, Value = s.Value, Label = s.Label, Color = s.Color })
                    .ToList()
            };
        }

        internal ContentOperationResult<ContentCategoryDto> CreateExpenseCategoryActionExecution(ContentCategoryUpsertDto dto)
        {
            var key = NormalizeKey(dto.Key);
            var label = NormalizeLabel(dto.Label);

            if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(label))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("invalid", "Key and label are required.");
            }

            using var db = new FinanceTrackerDbContext();
            if (db.ExpenseCategories.Any(c => c.Key == key))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("duplicate", "Expense category key already exists.");
            }

            var entity = new ExpenseCategoryData
            {
                Id = Guid.NewGuid(),
                Key = key,
                Label = label
            };

            db.ExpenseCategories.Add(entity);
            db.SaveChanges();

            return ContentOperationResult<ContentCategoryDto>.Ok(new ContentCategoryDto
            {
                Id = entity.Id,
                Key = entity.Key,
                Label = entity.Label
            });
        }

        internal ContentOperationResult<ContentCategoryDto> UpdateExpenseCategoryActionExecution(Guid id, ContentCategoryUpsertDto dto)
        {
            var key = NormalizeKey(dto.Key);
            var label = NormalizeLabel(dto.Label);

            if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(label))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("invalid", "Key and label are required.");
            }

            using var db = new FinanceTrackerDbContext();
            var entity = db.ExpenseCategories.FirstOrDefault(c => c.Id == id);
            if (entity == null)
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("not_found", "Expense category not found.");
            }

            if (db.ExpenseCategories.Any(c => c.Id != id && c.Key == key))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("duplicate", "Expense category key already exists.");
            }

            entity.Key = key;
            entity.Label = label;
            db.ExpenseCategories.Update(entity);
            db.SaveChanges();

            return ContentOperationResult<ContentCategoryDto>.Ok(new ContentCategoryDto
            {
                Id = entity.Id,
                Key = entity.Key,
                Label = entity.Label
            });
        }

        internal bool DeleteExpenseCategoryActionExecution(Guid id)
        {
            using var db = new FinanceTrackerDbContext();
            var entity = db.ExpenseCategories.FirstOrDefault(c => c.Id == id);
            if (entity == null) return false;

            db.ExpenseCategories.Remove(entity);
            db.SaveChanges();
            return true;
        }

        internal ContentOperationResult<ContentCategoryDto> CreateIncomeCategoryActionExecution(ContentCategoryUpsertDto dto)
        {
            var key = NormalizeKey(dto.Key);
            var label = NormalizeLabel(dto.Label);

            if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(label))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("invalid", "Key and label are required.");
            }

            using var db = new FinanceTrackerDbContext();
            if (db.IncomeCategories.Any(c => c.Key == key))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("duplicate", "Income category key already exists.");
            }

            var entity = new IncomeCategoryData
            {
                Id = Guid.NewGuid(),
                Key = key,
                Label = label
            };

            db.IncomeCategories.Add(entity);
            db.SaveChanges();

            return ContentOperationResult<ContentCategoryDto>.Ok(new ContentCategoryDto
            {
                Id = entity.Id,
                Key = entity.Key,
                Label = entity.Label
            });
        }

        internal ContentOperationResult<ContentCategoryDto> UpdateIncomeCategoryActionExecution(Guid id, ContentCategoryUpsertDto dto)
        {
            var key = NormalizeKey(dto.Key);
            var label = NormalizeLabel(dto.Label);

            if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(label))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("invalid", "Key and label are required.");
            }

            using var db = new FinanceTrackerDbContext();
            var entity = db.IncomeCategories.FirstOrDefault(c => c.Id == id);
            if (entity == null)
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("not_found", "Income category not found.");
            }

            if (db.IncomeCategories.Any(c => c.Id != id && c.Key == key))
            {
                return ContentOperationResult<ContentCategoryDto>.Fail("duplicate", "Income category key already exists.");
            }

            entity.Key = key;
            entity.Label = label;
            db.IncomeCategories.Update(entity);
            db.SaveChanges();

            return ContentOperationResult<ContentCategoryDto>.Ok(new ContentCategoryDto
            {
                Id = entity.Id,
                Key = entity.Key,
                Label = entity.Label
            });
        }

        internal bool DeleteIncomeCategoryActionExecution(Guid id)
        {
            using var db = new FinanceTrackerDbContext();
            var entity = db.IncomeCategories.FirstOrDefault(c => c.Id == id);
            if (entity == null) return false;

            db.IncomeCategories.Remove(entity);
            db.SaveChanges();
            return true;
        }

        internal ContentOperationResult<CurrencyDto> CreateCurrencyActionExecution(CurrencyUpsertDto dto)
        {
            var code = NormalizeCode(dto.Code);
            var symbol = NormalizeLabel(dto.Symbol);
            var name = NormalizeLabel(dto.Name);

            if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(symbol) || string.IsNullOrWhiteSpace(name))
            {
                return ContentOperationResult<CurrencyDto>.Fail("invalid", "Code, symbol, and name are required.");
            }

            using var db = new FinanceTrackerDbContext();
            if (db.Currencies.Any(c => c.Code == code))
            {
                return ContentOperationResult<CurrencyDto>.Fail("duplicate", "Currency code already exists.");
            }

            var entity = new CurrencyData
            {
                Id = Guid.NewGuid(),
                Code = code,
                Symbol = symbol,
                Name = name
            };

            db.Currencies.Add(entity);
            db.SaveChanges();

            return ContentOperationResult<CurrencyDto>.Ok(new CurrencyDto
            {
                Id = entity.Id,
                Code = entity.Code,
                Symbol = entity.Symbol,
                Name = entity.Name
            });
        }

        internal ContentOperationResult<CurrencyDto> UpdateCurrencyActionExecution(Guid id, CurrencyUpsertDto dto)
        {
            var code = NormalizeCode(dto.Code);
            var symbol = NormalizeLabel(dto.Symbol);
            var name = NormalizeLabel(dto.Name);

            if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(symbol) || string.IsNullOrWhiteSpace(name))
            {
                return ContentOperationResult<CurrencyDto>.Fail("invalid", "Code, symbol, and name are required.");
            }

            using var db = new FinanceTrackerDbContext();
            var entity = db.Currencies.FirstOrDefault(c => c.Id == id);
            if (entity == null)
            {
                return ContentOperationResult<CurrencyDto>.Fail("not_found", "Currency not found.");
            }

            if (db.Currencies.Any(c => c.Id != id && c.Code == code))
            {
                return ContentOperationResult<CurrencyDto>.Fail("duplicate", "Currency code already exists.");
            }

            entity.Code = code;
            entity.Symbol = symbol;
            entity.Name = name;
            db.Currencies.Update(entity);
            db.SaveChanges();

            return ContentOperationResult<CurrencyDto>.Ok(new CurrencyDto
            {
                Id = entity.Id,
                Code = entity.Code,
                Symbol = entity.Symbol,
                Name = entity.Name
            });
        }

        internal bool DeleteCurrencyActionExecution(Guid id)
        {
            using var db = new FinanceTrackerDbContext();
            var entity = db.Currencies.FirstOrDefault(c => c.Id == id);
            if (entity == null) return false;

            db.Currencies.Remove(entity);
            db.SaveChanges();
            return true;
        }

        internal ContentOperationResult<TransactionStatusDto> CreateTransactionStatusActionExecution(TransactionStatusUpsertDto dto)
        {
            var value = NormalizeKey(dto.Value);
            var label = NormalizeLabel(dto.Label);
            var color = NormalizeColor(dto.Color);

            if (string.IsNullOrWhiteSpace(value) || string.IsNullOrWhiteSpace(label) || string.IsNullOrWhiteSpace(color))
            {
                return ContentOperationResult<TransactionStatusDto>.Fail("invalid", "Value, label, and color are required.");
            }

            using var db = new FinanceTrackerDbContext();
            if (db.TransactionStatuses.Any(s => s.Value == value))
            {
                return ContentOperationResult<TransactionStatusDto>.Fail("duplicate", "Transaction status value already exists.");
            }

            var entity = new TransactionStatusData
            {
                Id = Guid.NewGuid(),
                Value = value,
                Label = label,
                Color = color
            };

            db.TransactionStatuses.Add(entity);
            db.SaveChanges();

            return ContentOperationResult<TransactionStatusDto>.Ok(new TransactionStatusDto
            {
                Id = entity.Id,
                Value = entity.Value,
                Label = entity.Label,
                Color = entity.Color
            });
        }

        internal ContentOperationResult<TransactionStatusDto> UpdateTransactionStatusActionExecution(Guid id, TransactionStatusUpsertDto dto)
        {
            var value = NormalizeKey(dto.Value);
            var label = NormalizeLabel(dto.Label);
            var color = NormalizeColor(dto.Color);

            if (string.IsNullOrWhiteSpace(value) || string.IsNullOrWhiteSpace(label) || string.IsNullOrWhiteSpace(color))
            {
                return ContentOperationResult<TransactionStatusDto>.Fail("invalid", "Value, label, and color are required.");
            }

            using var db = new FinanceTrackerDbContext();
            var entity = db.TransactionStatuses.FirstOrDefault(s => s.Id == id);
            if (entity == null)
            {
                return ContentOperationResult<TransactionStatusDto>.Fail("not_found", "Transaction status not found.");
            }

            if (db.TransactionStatuses.Any(s => s.Id != id && s.Value == value))
            {
                return ContentOperationResult<TransactionStatusDto>.Fail("duplicate", "Transaction status value already exists.");
            }

            entity.Value = value;
            entity.Label = label;
            entity.Color = color;
            db.TransactionStatuses.Update(entity);
            db.SaveChanges();

            return ContentOperationResult<TransactionStatusDto>.Ok(new TransactionStatusDto
            {
                Id = entity.Id,
                Value = entity.Value,
                Label = entity.Label,
                Color = entity.Color
            });
        }

        internal bool DeleteTransactionStatusActionExecution(Guid id)
        {
            using var db = new FinanceTrackerDbContext();
            var entity = db.TransactionStatuses.FirstOrDefault(s => s.Id == id);
            if (entity == null) return false;

            db.TransactionStatuses.Remove(entity);
            db.SaveChanges();
            return true;
        }
    }
}
