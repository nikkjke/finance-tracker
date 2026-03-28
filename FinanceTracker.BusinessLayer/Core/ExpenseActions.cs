using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.Domain.Models.Expense;

namespace FinanceTracker.BusinessLayer.Core
{
    public class ExpenseActions
    {
        public ExpenseActions()
        {
        }

        internal List<ExpenseDto> GetAllExpensesActionExecution()
        {
            return new List<ExpenseDto>()
            {
                new ExpenseDto()
                {
                    Id = Guid.NewGuid(),
                    StoreName = "Test Store",
                    Amount = 50.00m,
                    Category = "Food",
                    Date = DateTime.Now,
                    Notes = "Test expense",
                    PaymentMethod = "Card",
                    Status = "Completed"
                }
            };
        }

        internal ExpenseDto GetExpenseByIdActionExecution(Guid id)
        {
            return new ExpenseDto()
            {
                Id = id,
                StoreName = "Test Store",
                Amount = 50.00m,
                Category = "Food",
                Date = DateTime.Now,
                Notes = "Test expense",
                PaymentMethod = "Card",
                Status = "Completed"
            };
        }

        internal ExpenseDto CreateExpenseActionExecution(ExpenseDto dto)
        {
            dto.Id = Guid.NewGuid();
            return dto;
        }

        internal ExpenseDto UpdateExpenseActionExecution(Guid id, ExpenseDto dto)
        {
            dto.Id = id;
            return dto;
        }

        internal bool DeleteExpenseActionExecution(Guid id)
        {
            return true;
        }
    }
}