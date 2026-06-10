using System;

namespace FinanceTracker.Domain.Models.Admin
{
    public class ContentCategoryDto
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }
}
