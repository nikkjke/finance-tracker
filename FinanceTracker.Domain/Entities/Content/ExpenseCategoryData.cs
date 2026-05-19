using System;

namespace FinanceTracker.Domain.Entities.Content
{
    public class ExpenseCategoryData
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }
}
