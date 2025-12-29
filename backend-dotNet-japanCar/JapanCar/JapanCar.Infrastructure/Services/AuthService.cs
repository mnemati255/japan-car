using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Interfaces.Security;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JapanCar.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtSettings _jwtSettings;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            IUnitOfWork unitOfWork,
            IOptions<JwtSettings> jwtOptions,
            IPasswordHasher hasher,
            IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _jwtSettings = jwtOptions.Value;
            _passwordHasher = hasher;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUserName(dto.UserName, true);

            if (user == null)
                throw new Exception("User not found");

            if (!_passwordHasher.VerifyPassword(user.PasswordHash, dto.Password))
                throw new Exception("Invalid password");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    [
                        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                        new Claim(ClaimTypes.Name, user.UserName)
                    ]),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }


        public async Task<UserEntity?> Me()
        {
            var userName = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? string.Empty;
            if (string.IsNullOrEmpty(userName))
                return null;

            var user = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            return user;
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            var secretKey = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                ValidateIssuer = false,
                ValidIssuer = _jwtSettings.Issuer,
                ValidateAudience = false,
                ValidAudience = _jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                return principal;
            }
            catch (SecurityTokenExpiredException)
            {
                throw new SecurityTokenException("Token has expired.");
            }
            catch (Exception ex)
            {
                throw new SecurityTokenException("Invalid token", ex);
            }
        }
    }

}
