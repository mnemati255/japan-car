using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class GridDto<T>
    {
        public IEnumerable<T> Items { get; set; } = [];
        public int TotalPage { get; set; }
        public int? TotalCount { get; set; }
    }
}
