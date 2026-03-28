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
        public List<BudgetDto> GetAllBudgetsAction() => GetAllBudgetsActionExecution();
        public BudgetDto GetBudgetByIdAction(Guid id) => GetBudgetByIdActionExecution(id);
        public BudgetDto CreateBudgetAction(BudgetDto dto) => CreateBudgetActionExecution(dto);
        public BudgetDto UpdateBudgetAction(Guid id, BudgetDto dto) => UpdateBudgetActionExecution(id, dto);
        public bool DeleteBudgetAction(Guid id) => DeleteBudgetActionExecution(id);
    }
}