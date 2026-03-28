using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Income;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
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

        [HttpGet("getAll")]
        public IActionResult GetAllIncomes()
        {
            var incomes = _income.GetAllIncomesAction();
            return Ok(incomes);
        }

        [HttpGet("getById/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var income = _income.GetIncomeByIdAction(id);
            if (income is null)
            {
                return NotFound();
            }

            return Ok(income);
        }

        [HttpPost("create")]
        public IActionResult CreateIncome([FromBody] IncomeDto dto)
        {
            var created = _income.CreateIncomeAction(dto);
            return Ok(created);
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateIncome(Guid id, [FromBody] IncomeDto dto)
        {
            var updated = _income.UpdateIncomeAction(id, dto);
            if (updated is null)
                return NotFound();
            return Ok(updated);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteIncome(Guid id)
        {
            var deleted = _income.DeleteIncomeAction(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}