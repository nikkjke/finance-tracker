using System;

namespace FinanceTracker.Domain.Entities.User
{
    public class UserData
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        /// <summary>
        /// "User" or "Admin"
        /// </summary>
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; }
    }
}
