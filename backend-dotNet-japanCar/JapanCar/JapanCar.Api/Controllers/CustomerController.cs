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
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;


        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }


        [HttpGet]
        public async Task<IActionResult> GetCustomers(string? keyword, int? skip, int? take)
        {
            var result = await _customerService.GetCustomers(keyword, skip, take);
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var result = await _customerService.GetCustomerById(id);
            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> CreateCustomer(CustomerDto dto)
        {
            await _customerService.CreateCustomer(dto);
            return Ok();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, CustomerDto dto)
        {
            await _customerService.UpdateCustomer(id, dto);
            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            await _customerService.DeleteCustomer(id);
            return Ok();
        }
    }
}
