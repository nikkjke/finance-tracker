using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Domain.Models.Auth
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Terms must be accepted.")]
        public bool TermsAccepted { get; set; }
    }
}
