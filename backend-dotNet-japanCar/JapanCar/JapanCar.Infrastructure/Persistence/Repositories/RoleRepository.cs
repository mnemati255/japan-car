using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;

        public RoleRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<RoleEntity>> GetAllRoles()
        {
            var roles = await _context.Roles.ToListAsync();

            return roles.Select(x => new RoleEntity
            {
                RoleId = x.RoleId,
                RoleName = x.RoleName,
                Description = x.Description,
                CreatedDate = x.CreatedDate
            });
        }


        public async Task<IEnumerable<PermissionEntity>> GetAllPermissions()
        {
            return await _context.Permissions
                .Select(x => new PermissionEntity
                {
                    PermissionId = x.PermissionId,
                    Code = x.Code,
                    PermissionName = x.PermissionName,
                })
                .ToListAsync();
        }


        public async Task<RoleEntity?> GetRoleById(int id)
        {
            var role = await _context.Roles
                .Where(x => x.RoleId == id)
                .Include(x => x.RolePermissions)
                .FirstOrDefaultAsync();

            if (role == null) return null;

            return new RoleEntity
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description,
                PermissionIds = role.RolePermissions.Select(x => x.PermissionId).ToList()
            };
        }

        public async Task CreateRole(RoleEntity role)
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

        public async Task<bool> UpdateRole(int id, RoleEntity role)
        {
            var entity = await _context.Roles
                .Where(x => x.RoleId == id)
                .Include(x => x.RolePermissions)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            _context.RolePermissions.RemoveRange(entity.RolePermissions);

            entity.RoleName = role.RoleName;
            entity.Description = role.Description;
            entity.ModifiedDate = DateTime.Now;
            entity.RolePermissions = role.PermissionIds.Select(pid => new Models.RolePermission
            {
                PermissionId = pid
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRole(int id)
        {
            var entity = await _context.Roles
                .Where(x => x.RoleId == id)
                .Include(x => x.RolePermissions)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            _context.RolePermissions.RemoveRange(entity.RolePermissions);

            _context.Roles.Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
