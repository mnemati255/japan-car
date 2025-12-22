using JapanCar.Api.Filters;
using JapanCar.Application.DTOs;
using JapanCar.Application.Services;
using JapanCar.Common;
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
            var result = await _auctionService.GetAuctions();
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuctionById(int id, string locale)
        {
            var result = await _auctionService.GetAuctionById(id, locale);
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
        public async Task<IActionResult> UpdateAuction(string locale, int id, AuctionDto dto)
        {
            await _auctionService.UpdateAuction(locale, id, dto);
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
