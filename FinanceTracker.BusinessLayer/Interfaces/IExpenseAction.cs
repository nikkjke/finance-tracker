using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.Domain.Models.Expense;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IExpenseAction
    {
        List<ExpenseDto> GetAllExpensesAction(Guid userId);
        ExpenseDto? GetExpenseByIdAction(Guid id, Guid userId);
        ExpenseDto CreateExpenseAction(ExpenseDto dto, Guid userId);
        ExpenseDto? UpdateExpenseAction(Guid id, ExpenseDto dto, Guid userId);
        bool DeleteExpenseAction(Guid id, Guid userId);
    }
}