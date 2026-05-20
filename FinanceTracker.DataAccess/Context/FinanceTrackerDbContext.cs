using FinanceTracker.Domain.Entities.Budget;
using FinanceTracker.Domain.Entities.Content;
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
        public DbSet<ExpenseCategoryData> ExpenseCategories { get; set; }
        public DbSet<IncomeCategoryData> IncomeCategories { get; set; }
        public DbSet<CurrencyData> Currencies { get; set; }
        public DbSet<TransactionStatusData> TransactionStatuses { get; set; }

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

            modelBuilder.Entity<ExpenseCategoryData>(entity =>
            {
                entity.HasIndex(c => c.Key).IsUnique();
                entity.Property(c => c.Key).IsRequired();
                entity.Property(c => c.Label).IsRequired();
            });

            modelBuilder.Entity<IncomeCategoryData>(entity =>
            {
                entity.HasIndex(c => c.Key).IsUnique();
                entity.Property(c => c.Key).IsRequired();
                entity.Property(c => c.Label).IsRequired();
            });

            modelBuilder.Entity<CurrencyData>(entity =>
            {
                entity.HasIndex(c => c.Code).IsUnique();
                entity.Property(c => c.Code).IsRequired();
                entity.Property(c => c.Symbol).IsRequired();
                entity.Property(c => c.Name).IsRequired();
            });

            modelBuilder.Entity<TransactionStatusData>(entity =>
            {
                entity.HasIndex(s => s.Value).IsUnique();
                entity.Property(s => s.Value).IsRequired();
                entity.Property(s => s.Label).IsRequired();
                entity.Property(s => s.Color).IsRequired();
            });

            modelBuilder.Entity<ExpenseCategoryData>().HasData(
                new ExpenseCategoryData { Id = new Guid("1b93ed8a-5025-4f4e-8a26-5d69f9fae3a6"), Key = "food", Label = "Food & Groceries" },
                new ExpenseCategoryData { Id = new Guid("4765462e-b2e0-4031-8b32-4e44edfa9b65"), Key = "transport", Label = "Transport" },
                new ExpenseCategoryData { Id = new Guid("8f4c9b10-44f5-4f9e-8eaa-3d19a5b241d6"), Key = "entertainment", Label = "Entertainment" },
                new ExpenseCategoryData { Id = new Guid("5bd9f47d-85c7-4c81-88e1-7031c48a8de0"), Key = "shopping", Label = "Shopping" },
                new ExpenseCategoryData { Id = new Guid("c19b9f8a-dc5c-4a78-9a8a-60d7b5e0f2f4"), Key = "bills", Label = "Bills & Utilities" },
                new ExpenseCategoryData { Id = new Guid("7d4097d0-28f3-4bdb-a889-2a9d6b93659c"), Key = "health", Label = "Health" },
                new ExpenseCategoryData { Id = new Guid("e0a6e7ad-7c47-42e3-8e3b-2b3d93fdd59f"), Key = "education", Label = "Education" },
                new ExpenseCategoryData { Id = new Guid("5466d601-e99f-4d04-bebc-3d6a1f75e3db"), Key = "travel", Label = "Travel" },
                new ExpenseCategoryData { Id = new Guid("ed1e9a1b-4d55-4e9d-b682-86c75d3b5ad1"), Key = "other", Label = "Other" }
            );

            modelBuilder.Entity<IncomeCategoryData>().HasData(
                new IncomeCategoryData { Id = new Guid("c1ab1f76-00ea-48a9-9e78-1ac9a8182fbd"), Key = "salary", Label = "Salary" },
                new IncomeCategoryData { Id = new Guid("3bcb7c1b-4ab7-4c8c-9b2e-1a2dc7135e17"), Key = "freelance", Label = "Freelance" },
                new IncomeCategoryData { Id = new Guid("c61c4b6b-9782-4c4a-b734-4f6f2945f0c2"), Key = "investment", Label = "Investment" },
                new IncomeCategoryData { Id = new Guid("f0c2ff2f-113a-43fb-9874-4b7b8b60c2c9"), Key = "bonus", Label = "Bonus" },
                new IncomeCategoryData { Id = new Guid("c5f1b61a-2a52-4d4f-87b3-3f3e2d9f7568"), Key = "gift", Label = "Gift" },
                new IncomeCategoryData { Id = new Guid("d8a1ff0b-22bb-4d0b-9b03-2c80bf1d5a6e"), Key = "other_income", Label = "Other Income" }
            );

            modelBuilder.Entity<CurrencyData>().HasData(
                new CurrencyData { Id = new Guid("a1f980db-7a51-4029-9f7d-0ecfd28c36d9"), Code = "USD", Symbol = "$", Name = "US Dollar" },
                new CurrencyData { Id = new Guid("0d6b12da-4f7f-4dc2-8408-1b8b3a2f1b62"), Code = "EUR", Symbol = "EUR", Name = "Euro" },
                new CurrencyData { Id = new Guid("93e0f605-7a4a-46c7-8c24-0b029add2f2d"), Code = "GBP", Symbol = "GBP", Name = "British Pound" },
                new CurrencyData { Id = new Guid("b71ab74a-2dc3-4f91-9d61-dbc9a9f0f1f5"), Code = "MDL", Symbol = "lei", Name = "Moldovan Leu" }
            );

            modelBuilder.Entity<TransactionStatusData>().HasData(
                new TransactionStatusData { Id = new Guid("e6d8d6a6-7378-4c0d-9a16-63d7f91cd1f1"), Value = "completed", Label = "Completed", Color = "#10b981" },
                new TransactionStatusData { Id = new Guid("2b64c0a2-60b4-4a3b-9f56-9f581b5b5b43"), Value = "pending", Label = "Pending", Color = "#f59e0b" },
                new TransactionStatusData { Id = new Guid("0b9b3aa5-8aa6-4a4b-8c5a-2d91c46d59b5"), Value = "cancelled", Label = "Cancelled", Color = "#ef4444" }
            );
        }
    }
}
