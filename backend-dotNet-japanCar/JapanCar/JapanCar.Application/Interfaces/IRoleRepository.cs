using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IRoleRepository
    {
        Task<IEnumerable<RoleEntity>> GetAllRoles();
        Task<IEnumerable<PermissionEntity>> GetAllPermissions();
        Task<RoleEntity?> GetRoleById(int id);
        Task CreateRole(RoleEntity role);
        Task<bool> UpdateRole(int id, RoleEntity role);
        Task<bool> DeleteRole(int id);
    }
}
