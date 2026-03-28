using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceTracker.Domain.Entities.Expense
{
    public class ExpenseData
    {
        public Guid Id { get; set; }
        public string? StoreName { get; set; }
        public decimal Amount { get; set; }
        public string? Category { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Status { get; set; }
    }
}