using JapanCar.Application.DTOs;

namespace JapanCar.Api.DTOs
{
    public class CarFormDto
    {
        public CarDto Dto { get; set; } = new CarDto();
        public List<IFormFile> Images { get; set; } = [];
    }
}
