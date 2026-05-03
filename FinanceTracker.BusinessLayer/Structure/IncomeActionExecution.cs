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
        public List<IncomeDto> GetAllIncomesAction(Guid userId) => GetAllIncomesActionExecution(userId);
        public IncomeDto? GetIncomeByIdAction(Guid id, Guid userId) => GetIncomeByIdActionExecution(id, userId);
        public IncomeDto CreateIncomeAction(IncomeDto dto, Guid userId) => CreateIncomeActionExecution(dto, userId);
        public IncomeDto? UpdateIncomeAction(Guid id, IncomeDto dto, Guid userId) => UpdateIncomeActionExecution(id, dto, userId);
        public bool DeleteIncomeAction(Guid id, Guid userId) => DeleteIncomeActionExecution(id, userId);
    }
}