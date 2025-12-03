using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserEntity>> GetAllUsers();
        Task<UserEntity?> GetUserById(int id);
        Task<UserEntity?> GetUserByUserName(string userName, bool withPassword = false);
        Task CreateUser(UserEntity user);
        Task<bool> UpdateUser(int id, UserEntity user);
        Task<bool> DeleteUser(int id);

        /// <summary>
        /// آیا کاربری با این نقش وجود دارد؟
        /// </summary>
        Task<bool> ExistsUserWithRole(int roleId);
    }
}
