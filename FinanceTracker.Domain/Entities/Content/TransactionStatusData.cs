using System;

namespace FinanceTracker.Domain.Entities.Content
{
    public class TransactionStatusData
    {
        public Guid Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }
}
