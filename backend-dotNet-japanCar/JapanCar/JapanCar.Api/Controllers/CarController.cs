using JapanCar.Api.DTOs;
using JapanCar.Api.Filters;
using JapanCar.Application.DTOs;
using JapanCar.Application.Models;
using JapanCar.Application.Services;
using JapanCar.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly CarService _carService;

        public CarController(CarService carService)
        {
            _carService = carService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllCars([FromQuery] CarFilterDto filterDto)
        {
            var result = await _carService.GetCars(filterDto);
            return Ok(result);
        }


        [HttpGet("report-excel")]
        public async Task<IActionResult> GetReportExcel([FromQuery] CarFilterDto filterDto)
        {
            var fileBytes = await _carService.GetReportExcel(filterDto);
            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "CarReport.xlsx"
            );
        }


        [AllowAnonymous]
        [HttpGet("report-pdf")]
        public async Task<IActionResult> GetReportPdf([FromQuery] CarFilterDto filterDto)
        {
            var fileBytes = await _carService.GetReportPdf(filterDto);
            return File(fileBytes, "application/pdf", "CarReport.pdf");
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            var result = await _carService.GetCarById(id);
            return Ok(result);
        }


        [HttpGet("tabs-state/{id}")]
        public async Task<IActionResult> GetTabsState(int id)
        {
            var result = await _carService.GetTabsState(id);
            return Ok(result);
        }


        [HttpPost]
        [ServiceFilter(typeof(ValidateDtoFilter<CarDto>))]
        public async Task<IActionResult> CreateCar([FromForm] CarFormDto dto)
        {
            var files = new List<FileData>();

            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    using var ms = new MemoryStream();
                    await file.File.CopyToAsync(ms);

                    files.Add(new FileData
                    {
                        FileName = file.File.FileName,
                        FileType = file.Type,
                        Content = ms.ToArray()
                    });
                }
            }

            var userName = User.Identity?.Name ?? "";

            var sukuraNumber = await _carService.CreateCar(dto.Dto, files, userName);

            return Ok(sukuraNumber);
        }


        [HttpDelete("{carId}")]
        public async Task<IActionResult> DeleteCar(int carId)
        {
            await _carService.DeleteCar(carId);
            return Ok();
        }


        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidateDtoFilter<CarDto>))]
        public async Task<IActionResult> UpdateCar(int id, [FromForm] CarFormDto dto)
        {
            var files = new List<FileData>();

            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    if(file.File != null)
                    {
                        using var ms = new MemoryStream();
                        await file.File.CopyToAsync(ms);

                        files.Add(new FileData
                        {
                            FileName = file.File.FileName,
                            FileType = file.Type,
                            Content = ms.ToArray()
                        });
                    }
                }
            }

            var userName = User.Identity?.Name ?? "";

            var sukuraNumber = await _carService.UpdateCar(id, dto.Dto, files, userName);

            return Ok(sukuraNumber);
        }
    }
}