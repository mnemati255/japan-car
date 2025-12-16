using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarPartEntity
    {
        public int CarPartId { get; set; }
        public int? CarRepairHistoryId { get; set; }
        public int PartId { get; set; }
        public decimal PartCost { get; set; }
        public int? MechanicId { get; set; }
        public int? PartCount { get; set; }
    }
}
