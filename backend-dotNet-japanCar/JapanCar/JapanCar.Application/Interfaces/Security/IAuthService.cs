using JapanCar.Application.DTOs;
using JapanCar.Domain.Entities;
using System.Security.Claims;

namespace JapanCar.Application.Interfaces.Security
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginDto dto);
        Task<UserEntity> Me();
        ClaimsPrincipal ValidateToken(string token);
    }
}
