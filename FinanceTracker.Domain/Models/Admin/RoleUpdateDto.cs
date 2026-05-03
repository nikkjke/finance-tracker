using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Domain.Models.Admin
{
    public class RoleUpdateDto
    {
        [Required]
        public string NewRole { get; set; } = string.Empty;
    }
}
