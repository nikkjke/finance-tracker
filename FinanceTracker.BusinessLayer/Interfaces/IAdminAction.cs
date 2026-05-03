using System;
using System.Collections.Generic;
using FinanceTracker.Domain.Models.Admin;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IAdminAction
    {
        List<UserDetailsDto> GetAllUsersAction();
        bool ChangeUserRoleAction(Guid userId, string newRole);
        bool DeleteUserAction(Guid userId);
    }
}
