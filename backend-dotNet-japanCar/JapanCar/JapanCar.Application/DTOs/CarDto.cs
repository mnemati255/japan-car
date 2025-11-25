using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class CarDto
    {
        public string ModelName { get; set; }

        public string ColorName { get; set; }

        public int Year { get; set; }

        public int Mileage { get; set; }
    }
}
