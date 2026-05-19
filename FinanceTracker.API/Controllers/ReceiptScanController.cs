using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.ReceiptScan;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
    [Authorize]
    [Route("api/receiptscan")]
    [ApiController]
    public class ReceiptScanController : ControllerBase
    {
        internal IReceiptScanAction _receiptScan;

        public ReceiptScanController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _receiptScan = bl.ReceiptScanAction();
        }


        [HttpPost("scan")]
        public IActionResult ScanReceipt([FromBody] ReceiptScanRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.QrUrl))
                return BadRequest("Provide a QR URL.");

            try
            {
                var result = _receiptScan.ScanReceiptAction(request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Receipt scan failed.", detail = ex.Message });
            }
        }
    }
}
