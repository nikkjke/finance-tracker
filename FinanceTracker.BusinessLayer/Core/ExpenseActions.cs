using System;
using System.Collections.Generic;
using System.Linq;
using FinanceTracker.DataAccess.Context;
using FinanceTracker.Domain.Entities.Expense;
using FinanceTracker.Domain.Models.Expense;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.BusinessLayer.Core
{
    public class ExpenseActions
    {
        private static DateTime EnsureUtc(DateTime value)
        {
            return value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
            };
        }

        public ExpenseActions()
        {
        }

        internal List<ExpenseDto> GetAllExpensesActionExecution()
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var expenses = db.Expenses.ToList();
                return expenses.Select(item => new ExpenseDto
                {
                    Id = item.Id,
                    StoreName = item.StoreName,
                    Amount = item.Amount,
                    Category = item.Category,
                    Date = item.Date,
                    Notes = item.Notes,
                    PaymentMethod = item.PaymentMethod,
                    Status = item.Status
                }).ToList();
            }
        }

        internal ExpenseDto? GetExpenseByIdActionExecution(Guid id)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var item = db.Expenses.FirstOrDefault(x => x.Id == id);
                if (item == null) return null;
                return new ExpenseDto
                {
                    Id = item.Id,
                    StoreName = item.StoreName,
                    Amount = item.Amount,
                    Category = item.Category,
                    Date = item.Date,
                    Notes = item.Notes,
                    PaymentMethod = item.PaymentMethod,
                    Status = item.Status
                };
            }
        }

        internal ExpenseDto CreateExpenseActionExecution(ExpenseDto dto)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = new ExpenseData
                {
                    Id = Guid.NewGuid(),
                    StoreName = dto.StoreName,
                    Amount = dto.Amount,
                    Category = dto.Category,
                    Date = EnsureUtc(dto.Date),
                    Notes = dto.Notes,
                    PaymentMethod = dto.PaymentMethod,
                    Status = dto.Status
                };
                db.Expenses.Add(entity);
                db.SaveChanges();
                dto.Id = entity.Id;
                return dto;
            }
        }

        internal ExpenseDto? UpdateExpenseActionExecution(Guid id, ExpenseDto dto)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = db.Expenses.FirstOrDefault(x => x.Id == id);
                if (entity == null) return null;
                entity.StoreName = dto.StoreName;
                entity.Amount = dto.Amount;
                entity.Category = dto.Category;
                entity.Date = EnsureUtc(dto.Date);
                entity.Notes = dto.Notes;
                entity.PaymentMethod = dto.PaymentMethod;
                entity.Status = dto.Status;
                db.Expenses.Update(entity);
                db.SaveChanges();
                dto.Id = entity.Id;
                return dto;
            }
        }

        internal bool DeleteExpenseActionExecution(Guid id)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = db.Expenses.FirstOrDefault(x => x.Id == id);
                if (entity == null) return false;
                db.Expenses.Remove(entity);
                db.SaveChanges();
                return true;
            }
        }
    }
}