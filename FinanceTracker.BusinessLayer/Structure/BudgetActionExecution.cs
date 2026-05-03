using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Budget;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class BudgetActionExecution : BudgetActions, IBudgetAction
    {
        public List<BudgetDto> GetAllBudgetsAction(Guid userId) => GetAllBudgetsActionExecution(userId);
        public BudgetDto? GetBudgetByIdAction(Guid id, Guid userId) => GetBudgetByIdActionExecution(id, userId);
        public BudgetDto CreateBudgetAction(BudgetDto dto, Guid userId) => CreateBudgetActionExecution(dto, userId);
        public BudgetDto? UpdateBudgetAction(Guid id, BudgetDto dto, Guid userId) => UpdateBudgetActionExecution(id, dto, userId);
        public bool DeleteBudgetAction(Guid id, Guid userId) => DeleteBudgetActionExecution(id, userId);
    }
}