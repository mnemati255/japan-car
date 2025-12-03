using JapanCar.Application.DTOs;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces.Security
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginDto dto);
        Task<UserEntity> Me();
    }
}
