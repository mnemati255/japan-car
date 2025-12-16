using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class MechanicEntity
    {
        public int MechanicId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string MechanicName { get; set; } = null!;
        public string? Contact { get; set; }
    }
}
