using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.Domain.Models.Budget;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IBudgetAction
    {
        List<BudgetDto> GetAllBudgetsAction(Guid userId);
        BudgetDto? GetBudgetByIdAction(Guid id, Guid userId);
        BudgetDto CreateBudgetAction(BudgetDto dto, Guid userId);
        BudgetDto? UpdateBudgetAction(Guid id, BudgetDto dto, Guid userId);
        bool DeleteBudgetAction(Guid id, Guid userId);
    }
};