using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using FinanceTracker.DataAccess.Context;
using FinanceTracker.Domain.Entities.User;
using FinanceTracker.Domain.Models.Auth;
using Microsoft.IdentityModel.Tokens;

namespace FinanceTracker.BusinessLayer.Core
{
    public class AuthActions
    {
        private readonly string _jwtKey;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly int _expiresInMinutes;

        public AuthActions(string jwtKey, string jwtIssuer, string jwtAudience, int expiresInMinutes)
        {
            _jwtKey           = jwtKey;
            _jwtIssuer        = jwtIssuer;
            _jwtAudience      = jwtAudience;
            _expiresInMinutes = expiresInMinutes;
        }

        // ─── Register ────────────────────────────────────────────────────────

        /// <summary>
        /// Creates a new user account, hashes the password with BCrypt,
        /// persists to the database, and returns a JWT token.
        /// </summary>
        /// <exception cref="InvalidOperationException">
        /// Thrown when the email is already registered.
        /// </exception>
        internal AuthResponseDto RegisterExecution(RegisterDto dto)
        {
            using var db = new FinanceTrackerDbContext();

            // Check for duplicate email
            var exists = db.Users.Any(u => u.Email.ToLower() == dto.Email.ToLower());
            if (exists)
                throw new InvalidOperationException("Email is already registered.");

            var user = new UserData
            {
                Id           = Guid.NewGuid(),
                Name         = dto.Name.Trim(),
                Email        = dto.Email.Trim().ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role         = "User",
                CreatedAt    = DateTime.UtcNow
            };

            db.Users.Add(user);
            db.SaveChanges();

            var token = GenerateJwt(user);
            return BuildResponse(user, token);
        }

        // ─── Login ───────────────────────────────────────────────────────────

        /// <summary>
        /// Validates email + password against the stored BCrypt hash.
        /// Returns null when credentials are invalid.
        /// </summary>
        internal AuthResponseDto? LoginExecution(LoginDto dto)
        {
            using var db = new FinanceTrackerDbContext();

            var user = db.Users.FirstOrDefault(u => u.Email.ToLower() == dto.Email.Trim().ToLower());
            if (user is null) return null;

            var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!passwordValid) return null;

            var token = GenerateJwt(user);
            return BuildResponse(user, token);
        }

        // ─── JWT Generation ──────────────────────────────────────────────────

        private string GenerateJwt(UserData user)
        {
            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name,  user.Name),
                new Claim("Role", user.Role),  // "User" or "Admin"
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken(
                issuer:             _jwtIssuer,
                audience:           _jwtAudience,
                claims:             claims,
                expires:            DateTime.UtcNow.AddMinutes(_expiresInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ─── Helpers ─────────────────────────────────────────────────────────

        private static AuthResponseDto BuildResponse(UserData user, string token)
        {
            return new AuthResponseDto
            {
                Token = token,
                User  = new AuthUserDto
                {
                    Id        = user.Id.ToString(),
                    Name      = user.Name,
                    Email     = user.Email,
                    // Frontend expects lowercase: "user" or "admin"
                    Role      = user.Role.ToLower(),
                    CreatedAt = user.CreatedAt.ToString("o"),
                }
            };
        }
    }
}
