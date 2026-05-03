using FinanceTracker.Domain.Models.Auth;

namespace FinanceTracker.BusinessLayer.Interfaces
{
    public interface IAuthAction
    {
        /// <summary>
        /// Registers a new user. Returns the auth response (token + user) or throws on error.
        /// </summary>
        AuthResponseDto Register(RegisterDto dto);

        /// <summary>
        /// Validates credentials and returns the auth response (token + user), or null if invalid.
        /// </summary>
        AuthResponseDto? Login(LoginDto dto);
    }
}
