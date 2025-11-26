using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarBrandEntity
    {
        /// <summary>
        /// شناسه برند خودرو
        /// </summary>
        public int BrandId { get; set; }

        /// <summary>
        /// نام برند خودرو
        /// </summary>
        public string BrandName { get; set; } = null!;

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

        public ICollection<CarModelEntity> CarModels { get; set; } = new List<CarModelEntity>();
    }
}
