using FinanceTracker.Domain.Entities.Budget;
using FinanceTracker.Domain.Entities.Expense;
using FinanceTracker.Domain.Entities.Income;
using FinanceTracker.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.DataAccess.Context
{
    public class FinanceTrackerDbContext : DbContext
    {
        public DbSet<BudgetData> Budgets { get; set; }
        public DbSet<ExpenseData> Expenses { get; set; }
        public DbSet<IncomeData> Incomes { get; set; }
        public DbSet<UserData> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserData>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });
        }
    }
}
