using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarModelEntity
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

        public CarBrandEntity Brand { get; set; } = null!;

        public ICollection<CarEntity> Cars { get; set; } = new List<CarEntity>();
    }
}
