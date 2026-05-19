using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.ReceiptScan;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class ReceiptScanActionExecution : ReceiptScanActions, IReceiptScanAction
    {
        public ReceiptScanResultDto ScanReceiptAction(ReceiptScanRequestDto request)
            => ScanReceiptActionExecution(request);
    }
}
