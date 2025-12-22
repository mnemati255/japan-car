using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime? ToDateTime(this string? str)
        {
            if (string.IsNullOrEmpty(str))
                return null;

            if (str.Split("T").Length > 0)
                return DateTime.Parse(str.Split("T")[0]);

            if (str.Split(" ").Length > 0)
                return DateTime.Parse(str.Split(" ")[0]);

            return null;
        }
    }
}
