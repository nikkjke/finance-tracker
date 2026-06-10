using System;

namespace FinanceTracker.Domain.Entities.Content
{
    public class CurrencyData
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
