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
        public List<ExpenseDto> GetAllExpensesAction(Guid userId) => GetAllExpensesActionExecution(userId);
        public ExpenseDto? GetExpenseByIdAction(Guid id, Guid userId) => GetExpenseByIdActionExecution(id, userId);
        public ExpenseDto CreateExpenseAction(ExpenseDto dto, Guid userId) => CreateExpenseActionExecution(dto, userId);
        public ExpenseDto? UpdateExpenseAction(Guid id, ExpenseDto dto, Guid userId) => UpdateExpenseActionExecution(id, dto, userId);
        public bool DeleteExpenseAction(Guid id, Guid userId) => DeleteExpenseActionExecution(id, userId);
    }
}