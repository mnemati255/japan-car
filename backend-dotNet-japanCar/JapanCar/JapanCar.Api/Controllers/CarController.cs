using JapanCar.Api.DTOs;
using JapanCar.Api.Filters;
using JapanCar.Application.DTOs;
using JapanCar.Application.Models;
using JapanCar.Application.Services;
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
        public async Task<IActionResult> GetAllCars(int? auctionId, [FromQuery] CarFilterDto filterDto)
        {
            var result = await _carService.GetCars(filterDto, auctionId);
            return Ok(result);
        }


        [HttpGet("report-excel")]
        public async Task<IActionResult> GetExcelReport([FromQuery] CarFilterDto filterDto)
        {
            var fileBytes = await _carService.GetReportExcel(filterDto);
            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "CarReport.xlsx"
            );
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            var result = await _carService.GetCarById(id);
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
                    await file.CopyToAsync(ms);

                    files.Add(new FileData
                    {
                        FileName = file.FileName,
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
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);

                    files.Add(new FileData
                    {
                        FileName = file.FileName,
                        Content = ms.ToArray()
                    });
                }
            }

            var userName = User.Identity?.Name ?? "";

            var sukuraNumber = await _carService.UpdateCar(id, dto.Dto, files, userName);

            return Ok(sukuraNumber);
        }
    }
}