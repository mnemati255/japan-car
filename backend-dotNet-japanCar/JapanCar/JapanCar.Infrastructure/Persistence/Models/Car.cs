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
    /// نتیجه تست فنی
    /// </summary>
    public string? TechnicalTestResult { get; set; }

    /// <summary>
    /// وضعیت استفاده
    /// </summary>
    public string? UsageStatus { get; set; }

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

    public virtual ICollection<CarAuctionDetail> CarAuctionDetails { get; set; } = new List<CarAuctionDetail>();

    public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();

    public virtual ICollection<CarRepairHistory> CarRepairHistories { get; set; } = new List<CarRepairHistory>();

    public virtual CarColor Color { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual CarModel Model { get; set; } = null!;

    public virtual User? ModifiedByNavigation { get; set; }
}
