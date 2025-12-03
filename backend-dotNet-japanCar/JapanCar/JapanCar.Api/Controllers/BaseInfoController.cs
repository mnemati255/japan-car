using JapanCar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BaseInfoController : ControllerBase
    {
        private readonly BaseInfoService _baseInfoService;


        public BaseInfoController(BaseInfoService baseInfoService)
        {
            _baseInfoService = baseInfoService;
        }


        [HttpGet("color")]
        public async Task<IActionResult> GetColors()
        {
            var colors = await _baseInfoService.GetColors();
            return Ok(colors);
        }


        [HttpGet("model")]
        public async Task<IActionResult> GetModels()
        {
            var models = await _baseInfoService.GetModels();
            return Ok(models);
        }
    }
}
