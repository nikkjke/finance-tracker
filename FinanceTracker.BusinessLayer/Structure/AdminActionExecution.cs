using System;
using System.Collections.Generic;
using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Admin;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class AdminActionExecution : AdminActions, IAdminAction
    {
        public List<UserDetailsDto> GetAllUsersAction() => GetAllUsersActionExecution();
        public bool ChangeUserRoleAction(Guid userId, string newRole) => ChangeUserRoleActionExecution(userId, newRole);
        public bool DeleteUserAction(Guid userId) => DeleteUserActionExecution(userId);
        public AdminContentDto GetAdminContentAction() => GetAdminContentActionExecution();
        public ContentOperationResult<ContentCategoryDto> CreateExpenseCategoryAction(ContentCategoryUpsertDto dto) => CreateExpenseCategoryActionExecution(dto);
        public ContentOperationResult<ContentCategoryDto> UpdateExpenseCategoryAction(Guid id, ContentCategoryUpsertDto dto) => UpdateExpenseCategoryActionExecution(id, dto);
        public bool DeleteExpenseCategoryAction(Guid id) => DeleteExpenseCategoryActionExecution(id);
        public ContentOperationResult<ContentCategoryDto> CreateIncomeCategoryAction(ContentCategoryUpsertDto dto) => CreateIncomeCategoryActionExecution(dto);
        public ContentOperationResult<ContentCategoryDto> UpdateIncomeCategoryAction(Guid id, ContentCategoryUpsertDto dto) => UpdateIncomeCategoryActionExecution(id, dto);
        public bool DeleteIncomeCategoryAction(Guid id) => DeleteIncomeCategoryActionExecution(id);
        public ContentOperationResult<CurrencyDto> CreateCurrencyAction(CurrencyUpsertDto dto) => CreateCurrencyActionExecution(dto);
        public ContentOperationResult<CurrencyDto> UpdateCurrencyAction(Guid id, CurrencyUpsertDto dto) => UpdateCurrencyActionExecution(id, dto);
        public bool DeleteCurrencyAction(Guid id) => DeleteCurrencyActionExecution(id);
        public ContentOperationResult<TransactionStatusDto> CreateTransactionStatusAction(TransactionStatusUpsertDto dto) => CreateTransactionStatusActionExecution(dto);
        public ContentOperationResult<TransactionStatusDto> UpdateTransactionStatusAction(Guid id, TransactionStatusUpsertDto dto) => UpdateTransactionStatusActionExecution(id, dto);
        public bool DeleteTransactionStatusAction(Guid id) => DeleteTransactionStatusActionExecution(id);
    }
}
