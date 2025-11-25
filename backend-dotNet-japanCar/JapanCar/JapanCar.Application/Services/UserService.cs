using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<PermissionDto>> GetAllPermissions()
        {
            var cars = await _unitOfWork.UserRepository.GetAllPermissions();
            return cars.Select(x => new PermissionDto
            {
                Code = x.Code,
                PermissionId = x.PermissionId,
                PermissionName = x.PermissionName,
            });
        }

        public async Task<IEnumerable<RoleDto>> GetAllRoles()
        {
            var roles = await _unitOfWork.UserRepository.GetAllRoles();
            return roles.Select(x => new RoleDto
            {
                RoleId = x.RoleId,
                RoleName = x.RoleName,
                Description = x.Description,
            });
        }

        public async Task<RoleDto> GetRoleById(int id)
        {
            var role = await _unitOfWork.UserRepository.GetRoleById(id);
            return new RoleDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                Description = role.Description,
                PermissionIds = role.PermissionIds
            };
        }

        public async Task CreateRole(RoleDto dto)
        {
            await _unitOfWork.UserRepository.CreateRole(new Role
            {
                RoleName = dto.RoleName,
                Description = dto.Description,
                PermissionIds = dto.PermissionIds
            });
        }

        public async Task UpdateRole(int id, RoleDto dto)
        {
            await _unitOfWork.UserRepository.UpdateRole(id, new Role
            {
                RoleName = dto.RoleName,
                Description = dto.Description,
                PermissionIds = dto.PermissionIds
            });
        }

        public async Task DeleteRole(int id)
        {
            await _unitOfWork.UserRepository.DeleteRole(id);
        }
    }
}
