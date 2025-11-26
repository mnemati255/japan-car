using JapanCar.Api.Filters;
using JapanCar.Application.DTOs;
using JapanCar.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;

        public RoleController(RoleService userService)
        {
            _roleService = userService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var result = await _roleService.GetAllRoles();
            return Ok(result);
        }


        [HttpGet("permissions")]
        public async Task<IActionResult> GetAllPermissions()
        {
            var result = await _roleService.GetAllPermissions();
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var result = await _roleService.GetRoleById(id);
            return Ok(result);
        }


        [HttpPost]
        [ServiceFilter(typeof(ValidateDtoFilter<RoleDto>))]
        public async Task<IActionResult> CreateRole(RoleDto dto)
        {
            await _roleService.CreateRole(dto);
            return Ok();
        }


        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidateDtoFilter<RoleDto>))]
        public async Task<IActionResult> UpdateRole(int id, RoleDto dto)
        {
            await _roleService.UpdateRole(id, dto);
            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            await _roleService.DeleteRole(id);
            return Ok();
        }
    }
}
