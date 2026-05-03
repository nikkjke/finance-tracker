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
        List<IncomeDto> GetAllIncomesAction(Guid userId);
        IncomeDto? GetIncomeByIdAction(Guid id, Guid userId);
        IncomeDto CreateIncomeAction(IncomeDto dto, Guid userId);
        IncomeDto? UpdateIncomeAction(Guid id, IncomeDto dto, Guid userId);
        bool DeleteIncomeAction(Guid id, Guid userId);
    }
}