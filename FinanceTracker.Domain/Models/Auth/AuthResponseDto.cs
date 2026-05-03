namespace FinanceTracker.Domain.Models.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public AuthUserDto User { get; set; } = new();
    }

    public class AuthUserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        /// <summary>
        /// "user" or "admin" (lowercase — matches frontend expectations)
        /// </summary>
        public string Role { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}
