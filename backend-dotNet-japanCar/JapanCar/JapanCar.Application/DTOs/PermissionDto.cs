using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class PermissionDto
    {
        public int PermissionId { get; set; }
        public string PermissionName { get; set; } = null!;
        public string Code { get; set; } = null!;
    }
}
