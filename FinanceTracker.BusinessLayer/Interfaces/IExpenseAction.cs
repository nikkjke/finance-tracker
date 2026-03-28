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
        List<ExpenseDto> GetAllExpensesAction();
        ExpenseDto GetExpenseByIdAction(Guid id);
        ExpenseDto CreateExpenseAction(ExpenseDto dto);
        ExpenseDto UpdateExpenseAction(Guid id, ExpenseDto dto);
        bool DeleteExpenseAction(Guid id);
    }
}