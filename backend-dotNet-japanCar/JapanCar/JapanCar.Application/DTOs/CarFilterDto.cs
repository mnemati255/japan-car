using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class CarFilterDto
    {
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public int? BrandId { get; set; }
        public int? ModelId { get; set; }
        public int? ColorId { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public string? ChasisNumber { get; set; }
        public string? FuelType { get; set; }
        public string? TransmissionType { get; set; }
        public byte? PlateType { get; set; }
        public string? PlateNumber { get; set; }
    }
}
