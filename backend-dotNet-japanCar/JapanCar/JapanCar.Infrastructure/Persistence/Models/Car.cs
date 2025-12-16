using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Car
{
    /// <summary>
    /// شناسه خودرو
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// شناسه مدل خودرو
    /// </summary>
    public int ModelId { get; set; }

    /// <summary>
    /// شناسه رنگ خودرو
    /// </summary>
    public int ColorId { get; set; }

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

    /// <summary>
    /// نوع گیربکس خودرو (اتوماتیک، دستی، CVT و ...)
    /// </summary>
    public string? TransmissionType { get; set; }

    /// <summary>
    /// شماره بیمه‌نامه خودرو
    /// </summary>
    public string? InsurancePolicyNumber { get; set; }

    /// <summary>
    /// تاریخ شروع اعتبار بیمه خودرو
    /// </summary>
    public DateTime? InsuranceStartDate { get; set; }

    /// <summary>
    /// تاریخ انقضای بیمه خودرو
    /// </summary>
    public DateTime? InsuranceExpireDate { get; set; }

    /// <summary>
    /// وضعیت داشتن بیمه‌نامه (1 = دارد، 0 = ندارد)
    /// </summary>
    public bool HasInsurance { get; set; }

    /// <summary>
    /// ماه ساخت خودرو (عدد بین 1 تا 12)
    /// </summary>
    public byte? ManufactureMonth { get; set; }

    /// <summary>
    /// نوع پلاک خودرو (شخصی، عمومی/کار، اجاره‌ای، صادراتی و ...)
    /// </summary>
    public byte PlateType { get; set; }

    /// <summary>
    /// Vehicle plate number (may include letters and numbers)
    /// </summary>
    public string? PlateNumber { get; set; }

    public virtual ICollection<CarAuctionDetail> CarAuctionDetails { get; set; } = new List<CarAuctionDetail>();

    public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();

    public virtual ICollection<CarRepairHistory> CarRepairHistories { get; set; } = new List<CarRepairHistory>();

    public virtual CarColor Color { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual CarModel Model { get; set; } = null!;

    public virtual User? ModifiedByNavigation { get; set; }
}
