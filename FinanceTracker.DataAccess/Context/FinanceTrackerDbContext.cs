using FinanceTracker.Domain.Entities.Budget;
using FinanceTracker.Domain.Entities.Expense;
using FinanceTracker.Domain.Entities.Income;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.DataAccess.Context
{
    public class FinanceTrackerContext : DbContext
    {
        public DbSet<BudgetData> Budgets { get; set; }
        public DbSet<ExpenseData> Expenses { get; set; }
        public DbSet<IncomeData> Incomes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
