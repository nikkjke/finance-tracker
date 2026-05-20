using System.Collections.Generic;

namespace FinanceTracker.Domain.Models.Admin
{
    public class AdminContentDto
    {
        public List<ContentCategoryDto> ExpenseCategories { get; set; } = new();
        public List<ContentCategoryDto> IncomeCategories { get; set; } = new();
        public List<CurrencyDto> Currencies { get; set; } = new();
        public List<TransactionStatusDto> TransactionStatuses { get; set; } = new();
    }
}
