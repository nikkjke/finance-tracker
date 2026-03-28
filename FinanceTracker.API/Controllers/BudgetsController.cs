using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Budget;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
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

        [HttpGet("getAll")]
        public IActionResult GetAllBudgets()
        {
            var budgets = _budget.GetAllBudgetsAction();
            return Ok(budgets);
        }

        [HttpGet("getById/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var budget = _budget.GetBudgetByIdAction(id);
            if (budget is null)
            {
                return NotFound();
            }

            return Ok(budget);
        }

        [HttpPost("create")]
        public IActionResult CreateBudget([FromBody] BudgetDto dto)
        {
            var created = _budget.CreateBudgetAction(dto);
            return Ok(created);
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateBudget(Guid id, [FromBody] BudgetDto dto)
        {
            var updated = _budget.UpdateBudgetAction(id, dto);
            if (updated is null)
                return NotFound();
            return Ok(updated);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteBudget(Guid id)
        {
            var deleted = _budget.DeleteBudgetAction(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}