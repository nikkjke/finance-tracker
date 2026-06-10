using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Income;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceTracker.API.Controllers
{
    [Authorize]
    [Route("api/incomes")]
    [ApiController]
    public class IncomesController : ControllerBase
    {
        internal IIncomeAction _income;

        public IncomesController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _income = bl.IncomeAction();
        }

        private Guid GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
                throw new UnauthorizedAccessException("User not found or invalid token.");
            return userId;
        }

        [HttpGet("getAll")]
        public IActionResult GetAllIncomes()
        {
            try {
                var incomes = _income.GetAllIncomesAction(GetUserId());
                return Ok(incomes);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpGet("getById/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            try {
                var income = _income.GetIncomeByIdAction(id, GetUserId());
                if (income is null)
                {
                    return NotFound();
                }

                return Ok(income);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpPost("create")]
        public IActionResult CreateIncome([FromBody] IncomeDto dto)
        {
            try {
                var created = _income.CreateIncomeAction(dto, GetUserId());
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateIncome(Guid id, [FromBody] IncomeDto dto)
        {
            try {
                var updated = _income.UpdateIncomeAction(id, dto, GetUserId());
                if (updated is null)
                    return NotFound();
                return Ok(updated);
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteIncome(Guid id)
        {
            try {
                var deleted = _income.DeleteIncomeAction(id, GetUserId());
                if (!deleted)
                    return NotFound();
                return NoContent();
            } catch (UnauthorizedAccessException) { return Unauthorized(); }
        }
    }
}