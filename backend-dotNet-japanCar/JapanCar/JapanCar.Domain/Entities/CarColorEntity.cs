using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarColorEntity
    {
        public int ColorId { get; set; }

        public string ColorName { get; set; } = null!;

        public DateTime CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

    }
}
