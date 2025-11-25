using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class Car
    {
        /// <summary>
        /// شناسه خودرو
        /// </summary>
        public int CarId { get; set; }

        /// <summary>
        /// شناسه مدل خودرو
        /// </summary>
        public int ModelId { get; set; }

        public CarModel Model { get; set; } = null!;

        /// <summary>
        /// شناسه رنگ خودرو
        /// </summary>
        public int ColorId { get; set; }

        public CarColor Color { get; set; } = null!;

        /// <summary>
        /// شماره شاسی
        /// </summary>
        public string ChassisNumber { get; set; } = null!;

        /// <summary>
        /// سال ساخت
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// کارکرد خودرو
        /// </summary>
        public int Mileage { get; set; }

        /// <summary>
        /// حجم موتور
        /// </summary>
        public int? EngineVolume { get; set; }

        /// <summary>
        /// نوع سوخت
        /// </summary>
        public string? FuelType { get; set; }

        /// <summary>
        /// نتیجه تست فنی
        /// </summary>
        public string? TechnicalTestResult { get; set; }

        /// <summary>
        /// وضعیت استفاده
        /// </summary>
        public string? UsageStatus { get; set; }

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
    }
}
