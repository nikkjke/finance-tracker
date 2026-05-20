using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Domain.Models.Admin
{
    public class TransactionStatusUpsertDto
    {
        [Required]
        public string Value { get; set; } = string.Empty;

        [Required]
        public string Label { get; set; } = string.Empty;

        [Required]
        public string Color { get; set; } = string.Empty;
    }
}
