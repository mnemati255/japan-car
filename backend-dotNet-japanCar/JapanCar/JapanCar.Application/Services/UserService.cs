using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Interfaces.Security;
using JapanCar.Domain.Entities;
using System.Net;

namespace JapanCar.Application.Services
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsers()
        {
            var users = await _unitOfWork.UserRepository.GetAllUsers();

            return users.Select(x => new UserDto
            {
                UserId = x.UserId,
                Email = x.Email,
                UserName = x.UserName,
                IsActive = x.IsActive
            });
        }

        public async Task<UserDto> GetUserById(int id)
        {
            var user = await _unitOfWork.UserRepository.GetUserById(id);

            if(user == null)
                throw new AppException("Not found", HttpStatusCode.NotFound);

            return new UserDto
            {
                UserId = user.UserId,
                UserName= user.UserName,
                Email = user.Email,
                IsActive = user.IsActive,
                RoleIds = user.RoleIds
            };
        }

        public async Task CreateUser(UserDto dto)
        {
            if (string.IsNullOrEmpty(dto.Password))
                throw new AppException("Password is required.", HttpStatusCode.BadRequest);

            var user = await _unitOfWork.UserRepository.GetUserByUserName(dto.UserName);
            if(user != null)
                throw new AppException("UserName is duplicated.", HttpStatusCode.Conflict);

            await _unitOfWork.UserRepository.CreateUser(new UserEntity
            {
                Email = dto.Email,
                UserName = dto.UserName,
                PasswordHash = _passwordHasher.HashPassword(dto.Password),
                IsActive = true,
                RoleIds = dto.RoleIds
            });
        }

        public async Task UpdateUser(int id, UserDto dto)
        {
            var result = await _unitOfWork.UserRepository.UpdateUser(id, new UserEntity
            {
                Email= dto.Email,
                IsActive = dto.IsActive,
                ModifiedDate = DateTime.Now,
                RoleIds = dto.RoleIds
            });

            if(!result)
                throw new AppException("Not found", HttpStatusCode.NotFound);
        }

        public async Task DeleteUser(int id)
        {
            var result = await _unitOfWork.UserRepository.DeleteUser(id);

            if (!result)
                throw new AppException("Not found", HttpStatusCode.NotFound);
        }
    }
}
