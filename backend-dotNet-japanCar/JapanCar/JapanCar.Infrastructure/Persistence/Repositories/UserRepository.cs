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

        public async Task<IEnumerable<UserEntity>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            
            return users.Select(x => new UserEntity
            {
                UserId = x.UserId,
                Email = x.Email,
                UserName = x.UserName,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate
            });
        }


        public async Task<UserEntity?> GetUserById(int id)
        {
            var user = await _context.Users
                .Where(x => x.UserId == id)
                .Include(x => x.UserRoleUsers)
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            return new UserEntity
            {
                UserId = user.UserId,
                Email = user.Email,
                IsActive = user.IsActive,
                UserName = user.UserName,
                RoleIds = user.UserRoleUsers.Select(x => x.RoleId).ToList()
            };
        }


        public async Task<UserEntity?> GetUserByUserName(string userName, bool withPassword = false)
        {
            var user = await _context.Users
                .Where(x => x.UserName.Equals(userName))
                .Include(x => x.UserRoleUsers)
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            var result = new UserEntity
            {
                UserId = user.UserId,
                Email = user.Email,
                IsActive = user.IsActive,
                UserName = user.UserName,
                RoleIds = user.UserRoleUsers.Select(x => x.RoleId).ToList()
            };

            if (withPassword) result.PasswordHash = user.PasswordHash;

            return result;
        }


        public async Task CreateUser(UserEntity user)
        {
            var entity = new Models.User
            {
                UserName = user.UserName,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                IsActive = user.IsActive
            };

            if (user.RoleIds.Any())
            {
                entity.UserRoleUsers = user.RoleIds.Select(rid => new Models.UserRole
                {
                    RoleId = rid,
                }).ToList();
            }

            _context.Users.Add(entity);
            await _context.SaveChangesAsync();
        }


        public async Task<bool> UpdateUser(int id, UserEntity user)
        {
            var entity = await _context.Users
                .Where(x => x.UserId == id)
                .Include(x => x.UserRoleUsers)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            _context.UserRoles.RemoveRange(entity.UserRoleUsers);

            entity.Email = user.Email;
            entity.ModifiedDate = DateTime.Now;
            entity.IsActive = user.IsActive;
            entity.UserRoleUsers = user.RoleIds.Select(rid => new Models.UserRole
            {
                RoleId = rid,
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteUser(int id)
        {
            var entity = await _context.Users
                .Where(x => x.UserId == id)
                .Include(x => x.UserRoleUsers)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            _context.UserRoles.RemoveRange(entity.UserRoleUsers);

            _context.Users.Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsUserWithRole(int roleId)
        {
            var exists = await (from u in _context.Users
                                join ur in _context.UserRoles on u.UserId equals ur.UserId
                                where ur.RoleId == roleId
                                select u).AnyAsync();
            return exists;
        }
    }
}
