using Common.Exceptions;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Permission>> GetAllPermissions()
        {
            return await _context.Permissions
                .Select(x => new Permission
                {
                    PermissionId = x.PermissionId,
                    Code = x.Code,
                    PermissionName = x.PermissionName,
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            var roles = await _context.Roles.ToListAsync();

            return roles.Select(x => new Role
            {
                RoleId = x.RoleId,
                RoleName = x.RoleName,
                Description = x.Description,
            });
        }

        public async Task<Role> GetRoleById(int id)
        {
            var role = await _context.Roles
                .Where(x => x.RoleId == id)
                .Include(x => x.RolePermissions)
                .FirstOrDefaultAsync();

            if (role == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            return new Role
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description,
                PermissionIds = role.RolePermissions.Select(x => x.PermissionId).ToList()
            };
        }

        public async Task CreateRole(Role role)
        {
            var entity = new Models.Role
            {
                RoleName = role.RoleName,
                Description = role.Description,
            };

            if (role.PermissionIds.Any())
            {
                entity.RolePermissions = role.PermissionIds.Select(pid => new Models.RolePermission
                {
                    PermissionId = pid
                }).ToList();
            }

            _context.Roles.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRole(int id, Role role)
        {
            var entity = await _context.Roles
                .Where(x => x.RoleId == id)
                .Include(x => x.RolePermissions)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new Exception("Not found");

            _context.RolePermissions.RemoveRange(entity.RolePermissions);

            entity.RoleName = role.RoleName;
            entity.Description = role.Description;
            entity.RolePermissions = role.PermissionIds.Select(pid => new Models.RolePermission
            {
                RoleId = pid,
                PermissionId = pid
            }).ToList();

            _context.Roles.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRole(int id)
        {
            var entity = await _context.Roles
                .Where(x => x.RoleId == id)
                .Include(x => x.RolePermissions)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new Exception("Not found");

            _context.RolePermissions.RemoveRange(entity.RolePermissions);

            _context.Roles.Remove(entity);

            await _context.SaveChangesAsync();
        }
    }
}
