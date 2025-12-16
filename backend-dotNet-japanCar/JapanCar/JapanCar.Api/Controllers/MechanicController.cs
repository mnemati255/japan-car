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
    public class MechanicController : ControllerBase
    {
        private readonly MechanicService _mechanicService;


        public MechanicController(MechanicService mechanicService)
        {
            _mechanicService = mechanicService;
        }


        [HttpGet]
        public async Task<IActionResult> GetMechaincs(string? keyword, int? skip = null, int? take = null)
        {
            var mechaincs = await _mechanicService.GetMechanics(keyword, skip, take);
            return Ok(mechaincs);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetMechanicById(int id)
        {
            var mechainc = await _mechanicService.GetMechanicById(id);
            return Ok(mechainc);
        }


        [HttpPost]
        public async Task<IActionResult> CreateColor(MechanicDto dto)
        {
            await _mechanicService.CreateUpdateMechanic(dto, null);
            return Ok();
        }


        [HttpPut("{mechanicId}")]
        public async Task<IActionResult> UpdatePart(int mechanicId, MechanicDto dto)
        {
            await _mechanicService.CreateUpdateMechanic(dto, mechanicId);
            return Ok();
        }


        [HttpDelete("{mechanicId}")]
        public async Task<IActionResult> DeleteMechanic(int mechanicId)
        {
            await _mechanicService.DeleteMechanic(mechanicId);
            return Ok();
        }
    }
}
