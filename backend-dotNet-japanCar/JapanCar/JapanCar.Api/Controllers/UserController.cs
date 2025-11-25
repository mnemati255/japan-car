using JapanCar.Application.DTOs;
using JapanCar.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("permissions")]
        public async Task<IActionResult> GetAllPermissions()
        {
            var result = await _userService.GetAllPermissions();
            return Ok(result);
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var result = await _userService.GetAllRoles();
            return Ok(result);
        }

        [HttpGet("role/{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var result = await _userService.GetRoleById(id);
            return Ok(result);
        }

        [HttpPost("role")]
        public async Task<IActionResult> CreateRole(RoleDto dto)
        {
            await _userService.CreateRole(dto);
            return Ok();
        }

        [HttpPut("role/{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDto dto)
        {
            await _userService.UpdateRole(id, dto);
            return Ok();
        }

        [HttpDelete("role/{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            await _userService.DeleteRole(id);
            return Ok();
        }
    }
}
