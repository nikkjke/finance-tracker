using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Budget;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceTracker.API.Controllers
{
    [Authorize]
    [Route("api/budgets")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        internal IBudgetAction _budget;

        public BudgetsController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _budget = bl.BudgetAction();
        }

        private Guid GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
                throw new UnauthorizedAccessException("User not found or invalid token.");
            return userId;
        }

        [HttpGet("getAll")]
        public IActionResult GetAllBudgets()
        {
            try {
                var budgets = _budget.GetAllBudgetsAction(GetUserId());
                return Ok(budgets);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpGet("getById/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            try {
                var budget = _budget.GetBudgetByIdAction(id, GetUserId());
                if (budget is null)
                {
                    return NotFound();
                }

                return Ok(budget);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpPost("create")]
        public IActionResult CreateBudget([FromBody] BudgetDto dto)
        {
            try {
                var created = _budget.CreateBudgetAction(dto, GetUserId());
                return Ok(created);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateBudget(Guid id, [FromBody] BudgetDto dto)
        {
            try {
                var updated = _budget.UpdateBudgetAction(id, dto, GetUserId());
                if (updated is null)
                    return NotFound();
                return Ok(updated);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteBudget(Guid id)
        {
            try {
                var deleted = _budget.DeleteBudgetAction(id, GetUserId());
                if (!deleted)
                    return NotFound();
                return NoContent();
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }
    }
}