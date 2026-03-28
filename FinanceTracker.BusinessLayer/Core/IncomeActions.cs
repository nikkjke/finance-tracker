using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.Domain.Models.Income;

namespace FinanceTracker.BusinessLayer.Core
{
    public class IncomeActions
    {
        public IncomeActions()
        {
        }

        internal List<IncomeDto> GetAllIncomesActionExecution()
        {
            return new List<IncomeDto>()
            {
                new IncomeDto()
                {
                    Id = Guid.NewGuid(),
                    Source = "Salary",
                    Amount = 1500.00m,
                    Category = "Work",
                    Date = DateTime.Now,
                    Notes = "Monthly salary",
                    Status = "Completed"
                }
            };
        }

        internal IncomeDto GetIncomeByIdActionExecution(Guid id)
        {
            return new IncomeDto()
            {
                Id = id,
                Source = "Salary",
                Amount = 1500.00m,
                Category = "Work",
                Date = DateTime.Now,
                Notes = "Monthly salary",
                Status = "Completed"
            };
        }

        internal IncomeDto CreateIncomeActionExecution(IncomeDto dto)
        {
            dto.Id = Guid.NewGuid();
            return dto;
        }

        internal IncomeDto UpdateIncomeActionExecution(Guid id, IncomeDto dto)
        {
            dto.Id = id;
            return dto;
        }

        internal bool DeleteIncomeActionExecution(Guid id)
        {
            return true;
        }
    }
}