using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceTracker.Domain.Models.Income
{
    public class IncomeDto
    {
        public Guid Id { get; set; }
        public string? Source { get; set; }
        public decimal Amount { get; set; }
        public string? Category { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
        public string? Status { get; set; }
    }
}