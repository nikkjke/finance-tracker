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

            if (dto.NewRole != "Admin" && dto.NewRole != "User")
            {
                return BadRequest("Invalid role specified.");
            }

            var success = _adminAction.ChangeUserRoleAction(id, dto.NewRole);
            if (!success)
            {
                return NotFound("User not found.");
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

        [HttpGet("content")]
        public IActionResult GetAdminContent()
        {
            var content = _adminAction.GetAdminContentAction();
            return Ok(content);
        }

        [HttpPost("content/expense-categories")]
        public IActionResult CreateExpenseCategory([FromBody] ContentCategoryUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.CreateExpenseCategoryAction(dto);
            return HandleContentResult(result);
        }

        [HttpPut("content/expense-categories/{id:guid}")]
        public IActionResult UpdateExpenseCategory(Guid id, [FromBody] ContentCategoryUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.UpdateExpenseCategoryAction(id, dto);
            return HandleContentResult(result);
        }

        [HttpDelete("content/expense-categories/{id:guid}")]
        public IActionResult DeleteExpenseCategory(Guid id)
        {
            var success = _adminAction.DeleteExpenseCategoryAction(id);
            if (!success)
            {
                return NotFound("Expense category not found.");
            }

            return NoContent();
        }

        [HttpPost("content/income-categories")]
        public IActionResult CreateIncomeCategory([FromBody] ContentCategoryUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.CreateIncomeCategoryAction(dto);
            return HandleContentResult(result);
        }

        [HttpPut("content/income-categories/{id:guid}")]
        public IActionResult UpdateIncomeCategory(Guid id, [FromBody] ContentCategoryUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.UpdateIncomeCategoryAction(id, dto);
            return HandleContentResult(result);
        }

        [HttpDelete("content/income-categories/{id:guid}")]
        public IActionResult DeleteIncomeCategory(Guid id)
        {
            var success = _adminAction.DeleteIncomeCategoryAction(id);
            if (!success)
            {
                return NotFound("Income category not found.");
            }

            return NoContent();
        }

        [HttpPost("content/currencies")]
        public IActionResult CreateCurrency([FromBody] CurrencyUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.CreateCurrencyAction(dto);
            return HandleContentResult(result);
        }

        [HttpPut("content/currencies/{id:guid}")]
        public IActionResult UpdateCurrency(Guid id, [FromBody] CurrencyUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.UpdateCurrencyAction(id, dto);
            return HandleContentResult(result);
        }

        [HttpDelete("content/currencies/{id:guid}")]
        public IActionResult DeleteCurrency(Guid id)
        {
            var success = _adminAction.DeleteCurrencyAction(id);
            if (!success)
            {
                return NotFound("Currency not found.");
            }

            return NoContent();
        }

        [HttpPost("content/transaction-statuses")]
        public IActionResult CreateTransactionStatus([FromBody] TransactionStatusUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.CreateTransactionStatusAction(dto);
            return HandleContentResult(result);
        }

        [HttpPut("content/transaction-statuses/{id:guid}")]
        public IActionResult UpdateTransactionStatus(Guid id, [FromBody] TransactionStatusUpsertDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _adminAction.UpdateTransactionStatusAction(id, dto);
            return HandleContentResult(result);
        }

        [HttpDelete("content/transaction-statuses/{id:guid}")]
        public IActionResult DeleteTransactionStatus(Guid id)
        {
            var success = _adminAction.DeleteTransactionStatusAction(id);
            if (!success)
            {
                return NotFound("Transaction status not found.");
            }

            return NoContent();
        }

        private IActionResult HandleContentResult<T>(ContentOperationResult<T> result)
        {
            if (result.Success && result.Data != null)
            {
                return Ok(result.Data);
            }

            if (result.ErrorCode == "not_found")
            {
                return NotFound(result.ErrorMessage);
            }

            if (result.ErrorCode == "duplicate")
            {
                return Conflict(new { message = result.ErrorMessage });
            }

            return BadRequest(new { message = result.ErrorMessage ?? "Invalid request." });
        }
    }
}
