using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceTracker.Domain.Models.Budget
{
    public class BudgetDto
    {
        public Guid Id { get; set; }
        public string? Category { get; set; }
        public decimal Limit { get; set; }
        public decimal Spent { get; set; }
        public string? Month { get; set; }
        public string? Period { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}