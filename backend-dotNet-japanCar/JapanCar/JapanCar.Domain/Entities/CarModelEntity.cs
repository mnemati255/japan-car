using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarModelEntity
    {
        public int ModelId { get; set; }

        public int BrandId { get; set; }

        public string ModelName { get; set; } = null!;

        public string BrandName { get; set; } = null!;

        public DateTime CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }
    }
}
