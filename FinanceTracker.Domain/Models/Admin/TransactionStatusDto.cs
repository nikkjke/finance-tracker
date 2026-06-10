using System;

namespace FinanceTracker.Domain.Models.Admin
{
    public class TransactionStatusDto
    {
        public Guid Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }
}
