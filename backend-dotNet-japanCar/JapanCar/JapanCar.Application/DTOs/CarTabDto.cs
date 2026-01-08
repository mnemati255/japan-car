using JapanCar.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class CarTabDto
    {
        public CarDto CarDto { get; set; } = null!;
        public TabState TabStates { get; set; } = null!;
    }
}
