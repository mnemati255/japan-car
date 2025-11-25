using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarColor
    {
        /// <summary>
        /// شناسه رنگ خودرو
        /// </summary>
        public int ColorId { get; set; }

        /// <summary>
        /// نام رنگ خودرو
        /// </summary>
        public string ColorName { get; set; } = null!;

        /// <summary>
        /// تاریخ ایجاد
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// تاریخ ویرایش
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// ویرایش شده توسط
        /// </summary>
        public int? ModifiedBy { get; set; }

        public ICollection<Car> Cars { get; set; } = new List<Car>();
    }
}
