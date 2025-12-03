using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;


        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto);
            return Ok(new { AccessToken = token });
        }


        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await _authService.Me();
            return Ok(user);
        }
    }
}
