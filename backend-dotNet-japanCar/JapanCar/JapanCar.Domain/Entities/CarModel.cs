using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarModel
    {
        /// <summary>
        /// شناسه مدل خودرو
        /// </summary>
        public int ModelId { get; set; }

        /// <summary>
        /// شناسه برند خودرو
        /// </summary>
        public int BrandId { get; set; }

        /// <summary>
        /// نام مدل خودرو
        /// </summary>
        public string ModelName { get; set; } = null!;

        /// <summary>
        /// تاریخ ایجاد
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// تاریخ ویرایش
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// ایجاد شده توسط
        /// </summary>
        public int? CreatedBy { get; set; }

        /// <summary>
        /// ویرایش شده توسط
        /// </summary>
        public int? ModifiedBy { get; set; }

        public virtual CarBrand Brand { get; set; } = null!;

        public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
    }
}
