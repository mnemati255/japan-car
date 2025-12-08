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
    public class BaseInfoController : ControllerBase
    {
        private readonly BaseInfoService _baseInfoService;


        public BaseInfoController(BaseInfoService baseInfoService)
        {
            _baseInfoService = baseInfoService;
        }


        [HttpGet("color")]
        public async Task<IActionResult> GetColors(string? keyword, int? skip = null, int? take = null)
        {
            var colors = await _baseInfoService.GetColors(keyword, skip, take);
            return Ok(colors);
        }


        [HttpPost("color")]
        public async Task<IActionResult> CreateColor(ColorDto dto)
        {
            await _baseInfoService.CreateColor(dto);
            return Ok();
        }


        [HttpPut("color/{colorId}")]
        public async Task<IActionResult> UpdateColor(int colorId, ColorDto dto)
        {
            await _baseInfoService.UpdateColor(colorId, dto);
            return Ok();
        }


        [HttpDelete("color/{colorId}")]
        public async Task<IActionResult> DeleteColor(int colorId)
        {
            await _baseInfoService.DeleteColor(colorId);
            return Ok();
        }


        [HttpGet("brand")]
        public async Task<IActionResult> GetBrands(string? keyword, int? skip = null, int? take = null)
        {
            var models = await _baseInfoService.GetBrands(keyword, skip, take);
            return Ok(models);
        }


        [HttpPost("brand")]
        public async Task<IActionResult> CreateBrand(BrandDto dto)
        {
            await _baseInfoService.CreateBrand(dto);
            return Ok();
        }


        [HttpPut("brand/{brandId}")]
        public async Task<IActionResult> UpdateBrand(int brandId, BrandDto dto)
        {
            await _baseInfoService.UpdateBrand(brandId, dto);
            return Ok();
        }


        [HttpDelete("brand/{brandId}")]
        public async Task<IActionResult> DeleteBrand(int brandId)
        {
            await _baseInfoService.DeleteBrand(brandId);
            return Ok();
        }


        [HttpGet("model")]
        public async Task<IActionResult> GetModels(string? keyword, int? skip = null, int? take = null)
        {
            var models = await _baseInfoService.GetModels(keyword, skip, take);
            return Ok(models);
        }


        [HttpGet("model/{brandId}")]
        public async Task<IActionResult> GetModelsOfBrands(int brandId)
        {
            var models = await _baseInfoService.GetModelsOfBrands(brandId);
            return Ok(models);
        }


        [HttpPost("model")]
        public async Task<IActionResult> CreateModel(ModelDto dto)
        {
            await _baseInfoService.CreateModel(dto);
            return Ok();
        }


        [HttpPut("model/{modelId}")]
        public async Task<IActionResult> UpdateModel(int modelId, ModelDto dto)
        {
            await _baseInfoService.UpdateModel(modelId, dto);
            return Ok();
        }


        [HttpDelete("model/{modelId}")]
        public async Task<IActionResult> DeleteModel(int modelId)
        {
            await _baseInfoService.DeleteModel(modelId);
            return Ok();
        }
    }
}
