using JapanCar.Api.Filters;
using JapanCar.Application.DTOs;
using JapanCar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _userService.GetAllUsers();
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var result = await _userService.GetUserById(id);
            return Ok(result);
        }


        [HttpPost]
        [ServiceFilter(typeof(ValidateDtoFilter<UserDto>))]
        public async Task<IActionResult> CreateUser(UserDto dto)
        {
            await _userService.CreateUser(dto);
            return Ok();
        }


        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidateDtoFilter<UserDto>))]
        public async Task<IActionResult> UpdateUser(int id, UserDto dto)
        {
            await _userService.UpdateUser(id, dto);
            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUser(id);
            return Ok();
        }
    }
}
