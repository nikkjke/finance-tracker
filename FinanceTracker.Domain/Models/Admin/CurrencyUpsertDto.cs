using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Domain.Models.Admin
{
    public class CurrencyUpsertDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string Symbol { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
