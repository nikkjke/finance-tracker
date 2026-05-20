using System;
using System.Collections.Generic;
using FinanceTracker.Domain.Models.Admin;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IAdminAction
    {
        List<UserDetailsDto> GetAllUsersAction();
        bool ChangeUserRoleAction(Guid userId, string newRole);
        bool DeleteUserAction(Guid userId);
        AdminContentDto GetAdminContentAction();
        ContentOperationResult<ContentCategoryDto> CreateExpenseCategoryAction(ContentCategoryUpsertDto dto);
        ContentOperationResult<ContentCategoryDto> UpdateExpenseCategoryAction(Guid id, ContentCategoryUpsertDto dto);
        bool DeleteExpenseCategoryAction(Guid id);
        ContentOperationResult<ContentCategoryDto> CreateIncomeCategoryAction(ContentCategoryUpsertDto dto);
        ContentOperationResult<ContentCategoryDto> UpdateIncomeCategoryAction(Guid id, ContentCategoryUpsertDto dto);
        bool DeleteIncomeCategoryAction(Guid id);
        ContentOperationResult<CurrencyDto> CreateCurrencyAction(CurrencyUpsertDto dto);
        ContentOperationResult<CurrencyDto> UpdateCurrencyAction(Guid id, CurrencyUpsertDto dto);
        bool DeleteCurrencyAction(Guid id);
        ContentOperationResult<TransactionStatusDto> CreateTransactionStatusAction(TransactionStatusUpsertDto dto);
        ContentOperationResult<TransactionStatusDto> UpdateTransactionStatusAction(Guid id, TransactionStatusUpsertDto dto);
        bool DeleteTransactionStatusAction(Guid id);
    }
}
