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
        List<BudgetDto> GetAllBudgetsAction();
        BudgetDto GetBudgetByIdAction(Guid id);
        BudgetDto CreateBudgetAction(BudgetDto dto);
        BudgetDto UpdateBudgetAction(Guid id, BudgetDto dto);
        bool DeleteBudgetAction(Guid id);
    }
};