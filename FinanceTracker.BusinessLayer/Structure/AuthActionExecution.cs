using FinanceTracker.BusinessLayer.Core;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Auth;

namespace FinanceTracker.BusinessLayer.Structure
{
    public class AuthActionExecution : IAuthAction
    {
        private readonly AuthActions _actions;

        public AuthActionExecution(string jwtKey, string jwtIssuer, string jwtAudience, int expiresInMinutes)
        {
            _actions = new AuthActions(jwtKey, jwtIssuer, jwtAudience, expiresInMinutes);
        }

        public AuthResponseDto Register(RegisterDto dto)
            => _actions.RegisterExecution(dto);

        public AuthResponseDto? Login(LoginDto dto)
            => _actions.LoginExecution(dto);
    }
}
