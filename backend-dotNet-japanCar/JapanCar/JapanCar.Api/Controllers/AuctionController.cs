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
    public class AuctionController : ControllerBase
    {
        private readonly AuctionService _auctionService;


        public AuctionController(AuctionService auctionService)
        {
            _auctionService = auctionService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _auctionService.GetAllAuctions();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuctionById(int id)
        {
            var result = await _auctionService.GetAuctionById(id);
            return Ok(result);
        }


        [HttpPost]
        [ServiceFilter(typeof(ValidateDtoFilter<AuctionDto>))]
        public async Task<IActionResult> CreateAuction(AuctionDto dto)
        {
            await _auctionService.CreateAuction(dto);
            return Ok();
        }


        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidateDtoFilter<AuctionDto>))]
        public async Task<IActionResult> UpdateAuction(int id, AuctionDto dto)
        {
            await _auctionService.UpdateAuction(id, dto);
            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            await _auctionService.DeleteAuction(id);
            return Ok();
        }
    }
}
