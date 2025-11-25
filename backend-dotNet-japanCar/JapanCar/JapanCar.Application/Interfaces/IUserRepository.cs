using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<Permission>> GetAllPermissions();
        Task<IEnumerable<Role>> GetAllRoles();
        Task<Role> GetRoleById(int id);
        Task CreateRole(Role role);
        Task UpdateRole(int id, Role role);
        Task DeleteRole(int id);
    }
}
