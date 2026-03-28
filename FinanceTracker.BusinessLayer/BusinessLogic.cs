using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.BusinessLayer.Structure;

namespace FinanceTracker.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic()
    {
    }

    public IExpenseAction ExpenseAction()
    {
        return new ExpenseActionExecution();
    }

    public IIncomeAction IncomeAction()
    {
        return new IncomeActionExecution();
    }

    public IBudgetAction BudgetAction()
    {
        return new BudgetActionExecution();
    }
}
