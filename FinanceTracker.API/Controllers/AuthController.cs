using FinanceTracker.BusinessLayer;
using FinanceTracker.BusinessLayer.Interfaces;
using FinanceTracker.Domain.Models.Auth;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthAction _auth;

        public AuthController(IConfiguration configuration)
        {
            var jwtKey            = configuration["Jwt:Key"]            ?? throw new InvalidOperationException("Jwt:Key missing.");
            var jwtIssuer         = configuration["Jwt:Issuer"]         ?? "FinanceTrackerAPI";
            var jwtAudience       = configuration["Jwt:Audience"]       ?? "FinanceTrackerApp";
            var expiresInMinutes  = int.TryParse(configuration["Jwt:ExpiresInMinutes"], out var mins) ? mins : 60;

            var bl = new BusinessLogic();
            _auth = bl.AuthAction(jwtKey, jwtIssuer, jwtAudience, expiresInMinutes);
        }

        /// <summary>
        /// Registers a new user account and returns a JWT token.
        /// </summary>
        /// <response code="200">Registration successful — returns token + user info.</response>
        /// <response code="400">Invalid input data.</response>
        /// <response code="409">Email already registered.</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = _auth.Register(dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                // Email already exists
                return Conflict(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        /// <response code="200">Login successful — returns token + user info.</response>
        /// <response code="400">Invalid input data.</response>
        /// <response code="401">Invalid email or password.</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = _auth.Login(dto);
            if (result is null)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(result);
        }
    }
}
