using JapanCar.Application.DTOs;
using JapanCar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PartController : ControllerBase
    {
        private readonly PartService _partService;


        public PartController(PartService partService)
        {
            _partService = partService;
        }


        [HttpGet]
        public async Task<IActionResult> GetParts(string? keyword, int? skip = null, int? take = null)
        {
            var parts = await _partService.GetParts(keyword, skip, take);
            return Ok(parts);
        }


        [HttpGet("{locale}/{id}")]
        public async Task<IActionResult> GetPartById(string locale, int id)
        {
            var part = await _partService.GetPartById(locale, id);
            return Ok(part);
        }


        [HttpPost]
        public async Task<IActionResult> CreateColor(PartDto dto)
        {
            await _partService.CreatePart(dto);
            return Ok();
        }


        [HttpPut("{partId}")]
        public async Task<IActionResult> UpdatePart(string locale, int partId, PartDto dto)
        {
            await _partService.UpdatePart(locale, partId, dto);
            return Ok();
        }


        [HttpDelete("{partId}")]
        public async Task<IActionResult> DeletePart(int partId)
        {
            await _partService.DeletePart(partId);
            return Ok();
        }
    }
}
