using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Expense;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceTracker.API.Controllers
{
    [Authorize]
    [Route("api/expenses")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        internal IExpenseAction _expense;
        public ExpensesController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _expense = bl.ExpenseAction();
        }

        private Guid GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
                throw new UnauthorizedAccessException("User not found or invalid token.");
            return userId;
        }

        [HttpGet("getAll")]
        public IActionResult GetAllExpenses()
        {
            try {
                var expenses = _expense.GetAllExpensesAction(GetUserId());
                return Ok(expenses);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpGet("getById/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            try {
                var expense = _expense.GetExpenseByIdAction(id, GetUserId());
                if (expense is null)
                {
                    return NotFound();
                }
                return Ok(expense);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpPost("create")]
        public IActionResult CreateExpense([FromBody] ExpenseDto dto)
        {
            try {
                var created = _expense.CreateExpenseAction(dto, GetUserId());
                return Ok(created);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateExpense(Guid id, [FromBody] ExpenseDto dto)
        {
            try {
                var updated = _expense.UpdateExpenseAction(id, dto, GetUserId());
                if (updated is null)
                    return NotFound();
                return Ok(updated);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteExpense(Guid id)
        {
            try {
                var deleted = _expense.DeleteExpenseAction(id, GetUserId());
                if (!deleted)
                    return NotFound();
                return NoContent();
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }
    }
}