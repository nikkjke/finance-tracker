namespace FinanceTracker.Domain.Models.ReceiptScan
{
    public class ReceiptScanResultDto
    {
        public string? StoreName      { get; set; }
        public decimal? Amount        { get; set; }
        public string? Category       { get; set; }
        public string? Date           { get; set; }
        public string? PaymentMethod  { get; set; }
        public string? Notes          { get; set; }
    }
}
