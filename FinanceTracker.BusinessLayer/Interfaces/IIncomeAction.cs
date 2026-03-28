using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.Domain.Models.Income;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IIncomeAction
    {
        List<IncomeDto> GetAllIncomesAction();
        IncomeDto GetIncomeByIdAction(Guid id);
        IncomeDto CreateIncomeAction(IncomeDto dto);
        IncomeDto UpdateIncomeAction(Guid id, IncomeDto dto);
        bool DeleteIncomeAction(Guid id);
    }
}