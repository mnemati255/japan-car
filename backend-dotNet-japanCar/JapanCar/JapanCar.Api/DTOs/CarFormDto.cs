using JapanCar.Application.DTOs;

namespace JapanCar.Api.DTOs
{
    public class CarFormDto
    {
        public CarDto Dto { get; set; } = new CarDto();
        public List<CarImageDto> Images { get; set; } = [];
    }

    public class CarImageDto
    {
        public string? Type { get; set; }
        public IFormFile? File { get; set; }
    }
}
