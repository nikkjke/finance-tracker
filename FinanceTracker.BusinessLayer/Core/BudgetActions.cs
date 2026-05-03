using System;
using System.Collections.Generic;
using System.Linq;
using FinanceTracker.DataAccess.Context;
using FinanceTracker.Domain.Entities.Budget;
using FinanceTracker.Domain.Models.Budget;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.BusinessLayer.Core
{
    public class BudgetActions
    {
        private static DateTime? EnsureUtcNullable(DateTime? value)
        {
            if (!value.HasValue)
            {
                return null;
            }

            var dt = value.Value;
            return dt.Kind switch
            {
                DateTimeKind.Utc => dt,
                DateTimeKind.Local => dt.ToUniversalTime(),
                _ => DateTime.SpecifyKind(dt, DateTimeKind.Utc)
            };
        }

        public BudgetActions()
        {
        }

        internal List<BudgetDto> GetAllBudgetsActionExecution(Guid userId)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var budgets = db.Budgets
                    .Where(x => x.UserId == userId)
                    .ToList();
                return budgets.Select(item => new BudgetDto
                {
                    Id = item.Id,
                    Category = item.Category,
                    Limit = item.Limit,
                    Spent = item.Spent,
                    Month = item.Month,
                    Period = item.Period,
                    StartDate = item.StartDate,
                    EndDate = item.EndDate
                }).ToList();
            }
        }

        internal BudgetDto? GetBudgetByIdActionExecution(Guid id, Guid userId)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var item = db.Budgets.FirstOrDefault(x => x.Id == id && x.UserId == userId);
                if (item == null) return null;
                return new BudgetDto
                {
                    Id = item.Id,
                    Category = item.Category,
                    Limit = item.Limit,
                    Spent = item.Spent,
                    Month = item.Month,
                    Period = item.Period,
                    StartDate = item.StartDate,
                    EndDate = item.EndDate
                };
            }
        }

        internal BudgetDto CreateBudgetActionExecution(BudgetDto dto, Guid userId)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = new BudgetData
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Category = dto.Category,
                    Limit = dto.Limit,
                    Spent = dto.Spent,
                    Month = dto.Month,
                    Period = dto.Period,
                    StartDate = EnsureUtcNullable(dto.StartDate),
                    EndDate = EnsureUtcNullable(dto.EndDate)
                };
                db.Budgets.Add(entity);
                db.SaveChanges();
                dto.Id = entity.Id;
                return dto;
            }
        }

        internal BudgetDto? UpdateBudgetActionExecution(Guid id, BudgetDto dto, Guid userId)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = db.Budgets.FirstOrDefault(x => x.Id == id && x.UserId == userId);
                if (entity == null) return null;
                entity.Category = dto.Category;
                entity.Limit = dto.Limit;
                entity.Spent = dto.Spent;
                entity.Month = dto.Month;
                entity.Period = dto.Period;
                entity.StartDate = EnsureUtcNullable(dto.StartDate);
                entity.EndDate = EnsureUtcNullable(dto.EndDate);
                db.Budgets.Update(entity);
                db.SaveChanges();
                dto.Id = entity.Id;
                return dto;
            }
        }

        internal bool DeleteBudgetActionExecution(Guid id, Guid userId)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = db.Budgets.FirstOrDefault(x => x.Id == id && x.UserId == userId);
                if (entity == null) return false;
                db.Budgets.Remove(entity);
                db.SaveChanges();
                return true;
            }
        }
    }
}