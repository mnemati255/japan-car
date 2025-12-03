using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class ModelDto
    {
        public int ModelId { get; set; }
        public int BrandId { get; set; }
        public string ModelName { get; set; } = null!;
    }
}
