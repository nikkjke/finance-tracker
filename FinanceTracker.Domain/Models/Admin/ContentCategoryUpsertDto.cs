using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Domain.Models.Admin
{
    public class ContentCategoryUpsertDto
    {
        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Label { get; set; } = string.Empty;
    }
}
