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


        [HttpGet("color/{locale}/{id}")]
        public async Task<IActionResult> GetColorById(string locale, int id)
        {
            var color = await _baseInfoService.GetColorById(locale, id);
            return Ok(color);
        }


        [HttpPost("color")]
        public async Task<IActionResult> CreateColor(ColorDto dto)
        {
            await _baseInfoService.CreateColor(dto);
            return Ok();
        }


        [HttpPut("color/{colorId}")]
        public async Task<IActionResult> UpdateColor(string locale, int colorId, ColorDto dto)
        {
            await _baseInfoService.UpdateColor(locale, colorId, dto);
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
            var brands = await _baseInfoService.GetBrands(keyword, skip, take);
            return Ok(brands);
        }


        [HttpGet("brand/{locale}/{id}")]
        public async Task<IActionResult> GetBrandById(string locale, int id)
        {
            var brand = await _baseInfoService.GetBrandById(locale, id);
            return Ok(brand);
        }


        [HttpPost("brand")]
        public async Task<IActionResult> CreateBrand(BrandDto dto)
        {
            await _baseInfoService.CreateBrand(dto);
            return Ok();
        }


        [HttpPut("brand/{brandId}")]
        public async Task<IActionResult> UpdateBrand(string locale, int brandId, BrandDto dto)
        {
            await _baseInfoService.UpdateBrand(locale, brandId, dto);
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


        [HttpGet("model/{locale}/{id}")]
        public async Task<IActionResult> GetModelById(string locale, int id)
        {
            var models = await _baseInfoService.GetModelById(locale, id);
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
        public async Task<IActionResult> UpdateModel(string locale, int modelId, ModelDto dto)
        {
            await _baseInfoService.UpdateModel(locale, modelId, dto);
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
