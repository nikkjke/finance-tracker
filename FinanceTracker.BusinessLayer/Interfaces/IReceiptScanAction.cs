using FinanceTracker.Domain.Models.ReceiptScan;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IReceiptScanAction
    {
        ReceiptScanResultDto ScanReceiptAction(ReceiptScanRequestDto request);
    }
}
