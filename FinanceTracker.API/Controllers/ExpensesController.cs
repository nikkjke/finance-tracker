using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Expense;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
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

        [HttpGet("getAll")]
        public IActionResult GetAllExpenses()
        {
            var expenses = _expense.GetAllExpensesAction();
            return Ok(expenses);
        }

        [HttpGet("getById/{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var expense = _expense.GetExpenseByIdAction(id);
            if (expense is null)
            {
                return NotFound();
            }

            return Ok(expense);
        }

        [HttpPost("create")]
        public IActionResult CreateExpense([FromBody] ExpenseDto dto)
        {
            var created = _expense.CreateExpenseAction(dto);
            return Ok(created);
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateExpense(Guid id, [FromBody] ExpenseDto dto)
        {
            var updated = _expense.UpdateExpenseAction(id, dto);
            if (updated is null)
                return NotFound();
            return Ok(updated);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteExpense(Guid id)
        {
            var deleted = _expense.DeleteExpenseAction(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}