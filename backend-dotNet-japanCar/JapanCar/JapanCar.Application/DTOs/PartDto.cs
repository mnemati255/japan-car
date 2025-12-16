using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class PartDto
    {
        public int PartId { get; set; }

        public decimal PartPrice { get; set; }

        public DateTime? CreatedAt { get; set; }

        public string PartName { get; set; } = null!;

        public string? PartDescription { get; set; }
    }
}
