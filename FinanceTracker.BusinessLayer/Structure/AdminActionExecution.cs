using System;
using System.Collections.Generic;
using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Admin;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class AdminActionExecution : AdminActions, IAdminAction
    {
        public List<UserDetailsDto> GetAllUsersAction() => GetAllUsersActionExecution();
        public bool ChangeUserRoleAction(Guid userId, string newRole) => ChangeUserRoleActionExecution(userId, newRole);
        public bool DeleteUserAction(Guid userId) => DeleteUserActionExecution(userId);
    }
}
