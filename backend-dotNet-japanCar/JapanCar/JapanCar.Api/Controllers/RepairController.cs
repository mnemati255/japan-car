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
    public class RepairController : ControllerBase
    {
        private readonly RepairService _repairService;


        public RepairController(RepairService repairService)
        {
            _repairService = repairService;
        }


        [HttpGet("{carId}")]
        public async Task<IActionResult> GetRepairsOfCar(int carId, [FromQuery] RepairFilterDto filterDto)
        {
            var items = await _repairService.GetRepairsOfCar(carId, filterDto);
            return Ok(items);
        }


        [HttpGet("by-id/{id}")]
        public async Task<IActionResult> GetRepairById(int id, string locale)
        {
            var result = await _repairService.GetRepairById(id, locale);
            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> CreateRepair(RepairDto dto)
        {
            await _repairService.CreateRepair(dto);
            return Ok();
        }


        [HttpDelete("{repairId}")]
        public async Task<IActionResult> DeleteRepair(int repairId)
        {
            await _repairService.DeleteRepair(repairId);
            return Ok();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRepair(string locale, int id, RepairDto dto)
        {
            await _repairService.UpdateRepair(locale, id, dto);
            return Ok();
        }
    }
}
