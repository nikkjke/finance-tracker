using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminAction _adminAction;

        public AdminController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _adminAction = bl.AdminAction();
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _adminAction.GetAllUsersAction();
            return Ok(users);
        }

        [HttpPut("users/{id:guid}/role")]
        public IActionResult ChangeUserRole(Guid id, [FromBody] RoleUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = _adminAction.ChangeUserRoleAction(id, dto.NewRole);
            if (!success)
            {
                return NotFound("User not found or invalid role.");
            }

            return Ok(new { message = "Role updated successfully." });
        }

        [HttpDelete("users/{id:guid}")]
        public IActionResult DeleteUser(Guid id)
        {
            var success = _adminAction.DeleteUserAction(id);
            if (!success)
            {
                return NotFound("User not found.");
            }

            return NoContent();
        }
    }
}
