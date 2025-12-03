using JapanCar.Application.Interfaces.Security;
using Microsoft.AspNetCore.Identity;

namespace JapanCar.Infrastructure.Services
{
    public class PasswordHasherAdapter : IPasswordHasher
    {
        private readonly PasswordHasher<object> _hasher = new();

        public string HashPassword(string password)
        {
            return _hasher.HashPassword(null!, password);
        }

        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            var verify = _hasher.VerifyHashedPassword(null!, hashedPassword, providedPassword);
            return verify == PasswordVerificationResult.Success;
        }
    }
}
