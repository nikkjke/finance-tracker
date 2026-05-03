using System;
using System.Collections.Generic;
using System.Linq;
using FinanceTracker.DataAccess.Context;
using FinanceTracker.Domain.Models.Admin;

namespace FinanceTracker.BusinessLayer.Core
{
    public class AdminActions
    {
        internal List<UserDetailsDto> GetAllUsersActionExecution()
        {
            using var db = new FinanceTrackerDbContext();
            return db.Users.Select(u => new UserDetailsDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToList();
        }

        internal bool ChangeUserRoleActionExecution(Guid userId, string newRole)
        {
            using var db = new FinanceTrackerDbContext();
            var user = db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return false;

            // Simple validation
            if (newRole != "Admin" && newRole != "User") return false;

            user.Role = newRole;
            db.Users.Update(user);
            db.SaveChanges();
            return true;
        }

        internal bool DeleteUserActionExecution(Guid userId)
        {
            using var db = new FinanceTrackerDbContext();
            var user = db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return false;

            // Delete all associated data
            var expenses = db.Expenses.Where(e => e.UserId == userId).ToList();
            db.Expenses.RemoveRange(expenses);

            var incomes = db.Incomes.Where(i => i.UserId == userId).ToList();
            db.Incomes.RemoveRange(incomes);

            var budgets = db.Budgets.Where(b => b.UserId == userId).ToList();
            db.Budgets.RemoveRange(budgets);

            // Finally, delete the user
            db.Users.Remove(user);
            db.SaveChanges();
            return true;
        }
    }
}
