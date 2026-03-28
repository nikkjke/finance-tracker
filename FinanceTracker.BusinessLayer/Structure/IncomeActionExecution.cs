using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Income;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class IncomeActionExecution : IncomeActions, IIncomeAction
    {
        public List<IncomeDto> GetAllIncomesAction() => GetAllIncomesActionExecution();
        public IncomeDto GetIncomeByIdAction(Guid id) => GetIncomeByIdActionExecution(id);
        public IncomeDto CreateIncomeAction(IncomeDto dto) => CreateIncomeActionExecution(dto);
        public IncomeDto UpdateIncomeAction(Guid id, IncomeDto dto) => UpdateIncomeActionExecution(id, dto);
        public bool DeleteIncomeAction(Guid id) => DeleteIncomeActionExecution(id);
    }
}