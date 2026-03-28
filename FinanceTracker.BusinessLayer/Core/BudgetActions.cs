using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.Domain.Models.Budget;

namespace FinanceTracker.BusinessLayer.Core
{
    public class BudgetActions
    {
        public BudgetActions()
        {
        }

        internal List<BudgetDto> GetAllBudgetsActionExecution()
        {
            return new List<BudgetDto>()
            {
                new BudgetDto()
                {
                    Id = Guid.NewGuid(),
                    Category = "Food",
                    Limit = 500.00m,
                    Spent = 200.00m,
                    Month = DateTime.Now.ToString("yyyy-MM"),
                    Period = "monthly",
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddMonths(1)
                }
            };
        }

        internal BudgetDto GetBudgetByIdActionExecution(Guid id)
        {
            return new BudgetDto()
            {
                Id = id,
                Category = "Food",
                Limit = 500.00m,
                Spent = 200.00m,
                Month = DateTime.Now.ToString("yyyy-MM"),
                Period = "monthly",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddMonths(1)
            };
        }

        internal BudgetDto CreateBudgetActionExecution(BudgetDto dto)
        {
            dto.Id = Guid.NewGuid();
            return dto;
        }

        internal BudgetDto UpdateBudgetActionExecution(Guid id, BudgetDto dto)
        {
            dto.Id = id;
            return dto;
        }

        internal bool DeleteBudgetActionExecution(Guid id)
        {
            return true;
        }
    }
}