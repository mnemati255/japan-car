using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Interfaces.Security;
using JapanCar.Domain.Entities;
using System.Net;

namespace JapanCar.Application.Services
{
    public class RoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<PermissionDto>> GetAllPermissions()
        {
            var cars = await _unitOfWork.RoleRepository.GetAllPermissions();
            return cars.Select(x => new PermissionDto
            {
                Code = x.Code,
                PermissionId = x.PermissionId,
                PermissionName = x.PermissionName,
            });
        }

        public async Task<IEnumerable<RoleDto>> GetAllRoles()
        {
            var roles = await _unitOfWork.RoleRepository.GetAllRoles();

            return roles.Select(x => new RoleDto
            {
                RoleId = x.RoleId,
                RoleName = x.RoleName,
                Description = x.Description,
                CreatedAt = x.CreatedDate
            });
        }

        public async Task<RoleDto> GetRoleById(int id)
        {
            var role = await _unitOfWork.RoleRepository.GetRoleById(id);

            if(role == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

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
            await _unitOfWork.RoleRepository.CreateRole(new RoleEntity
            {
                RoleName = dto.RoleName,
                Description = dto.Description,
                PermissionIds = dto.PermissionIds
            });
        }

        public async Task UpdateRole(int id, RoleDto dto)
        {
            var result = await _unitOfWork.RoleRepository.UpdateRole(id, new RoleEntity
            {
                RoleName = dto.RoleName,
                Description = dto.Description,
                PermissionIds = dto.PermissionIds
            });

            if(!result)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);
        }

        public async Task DeleteRole(int id)
        {
            var userExists = await _unitOfWork.UserRepository.ExistsUserWithRole(id);
            if (userExists)
                throw new AppException("The Role is assigned to users and cannot be deleted.", HttpStatusCode.Conflict);

            var result = await _unitOfWork.RoleRepository.DeleteRole(id);
            if (!result)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);
        }
    }
}
