using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure.Configuration
{
    public class JwtSettings
    {
        public string SecretKey { get; set; } = null!;
        public int ExpireMinutes { get; set; }
        public string? Issuer { get; set; }
        public string? Audience { get; set; }
    }
}
