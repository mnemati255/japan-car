using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class MechanicDto
    {
        public int MechanicId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string MechanicName { get; set; } = null!;
        public string? Contact { get; set; }
    }
}
