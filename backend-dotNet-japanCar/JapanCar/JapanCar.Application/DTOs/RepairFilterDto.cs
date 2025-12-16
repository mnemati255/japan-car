using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class RepairFilterDto
    {
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public string? RepairDate { get; set; }
        public int? MechanicId { get; set; }
    }
}
