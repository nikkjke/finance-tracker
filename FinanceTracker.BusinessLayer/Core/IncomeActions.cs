using System;
using System.Collections.Generic;
using System.Linq;
using FinanceTracker.DataAccess.Context;
using FinanceTracker.Domain.Entities.Income;
using FinanceTracker.Domain.Models.Income;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.BusinessLayer.Core
{
    public class IncomeActions
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

        public IncomeActions()
        {
        }

        internal List<IncomeDto> GetAllIncomesActionExecution()
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var incomes = db.Incomes.ToList();
                return incomes.Select(item => new IncomeDto
                {
                    Id = item.Id,
                    Source = item.Source,
                    Amount = item.Amount,
                    Category = item.Category,
                    Date = item.Date,
                    Notes = item.Notes,
                    Status = item.Status
                }).ToList();
            }
        }

        internal IncomeDto? GetIncomeByIdActionExecution(Guid id)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var item = db.Incomes.FirstOrDefault(x => x.Id == id);
                if (item == null) return null;
                return new IncomeDto
                {
                    Id = item.Id,
                    Source = item.Source,
                    Amount = item.Amount,
                    Category = item.Category,
                    Date = item.Date,
                    Notes = item.Notes,
                    Status = item.Status
                };
            }
        }

        internal IncomeDto CreateIncomeActionExecution(IncomeDto dto)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = new IncomeData
                {
                    Id = Guid.NewGuid(),
                    Source = dto.Source,
                    Amount = dto.Amount,
                    Category = dto.Category,
                    Date = EnsureUtc(dto.Date),
                    Notes = dto.Notes,
                    Status = dto.Status
                };
                db.Incomes.Add(entity);
                db.SaveChanges();
                dto.Id = entity.Id;
                return dto;
            }
        }

        internal IncomeDto UpdateIncomeActionExecution(Guid id, IncomeDto dto)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = db.Incomes.FirstOrDefault(x => x.Id == id);
                if (entity == null) return null;
                entity.Source = dto.Source;
                entity.Amount = dto.Amount;
                entity.Category = dto.Category;
                entity.Date = EnsureUtc(dto.Date);
                entity.Notes = dto.Notes;
                entity.Status = dto.Status;
                db.Incomes.Update(entity);
                db.SaveChanges();
                dto.Id = entity.Id;
                return dto;
            }
        }

        internal bool DeleteIncomeActionExecution(Guid id)
        {
            using (var db = new FinanceTrackerDbContext())
            {
                var entity = db.Incomes.FirstOrDefault(x => x.Id == id);
                if (entity == null) return false;
                db.Incomes.Remove(entity);
                db.SaveChanges();
                return true;
            }
        }
    }
}