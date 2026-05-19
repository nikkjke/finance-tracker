namespace FinanceTracker.Domain.Models.Admin
{
    public class ContentOperationResult<T>
    {
        public bool Success { get; private set; }
        public string? ErrorCode { get; private set; }
        public string? ErrorMessage { get; private set; }
        public T? Data { get; private set; }

        public static ContentOperationResult<T> Ok(T data)
        {
            return new ContentOperationResult<T> { Success = true, Data = data };
        }

        public static ContentOperationResult<T> Fail(string errorCode, string errorMessage)
        {
            return new ContentOperationResult<T>
            {
                Success = false,
                ErrorCode = errorCode,
                ErrorMessage = errorMessage
            };
        }
    }
}
