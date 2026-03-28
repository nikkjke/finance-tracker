using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Expense;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class ExpenseActionExecution : ExpenseActions, IExpenseAction
    {
        public List<ExpenseDto> GetAllExpensesAction() => GetAllExpensesActionExecution();
        public ExpenseDto GetExpenseByIdAction(Guid id) => GetExpenseByIdActionExecution(id);
        public ExpenseDto CreateExpenseAction(ExpenseDto dto) => CreateExpenseActionExecution(dto);
        public ExpenseDto UpdateExpenseAction(Guid id, ExpenseDto dto) => UpdateExpenseActionExecution(id, dto);
        public bool DeleteExpenseAction(Guid id) => DeleteExpenseActionExecution(id);
    }
}