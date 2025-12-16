using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class PartEntity
    {
        public int PartId { get; set; }

        public decimal PartPrice { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string PartName { get; set; } = null!;

        public string? PartDescription { get; set; }
    }
}
