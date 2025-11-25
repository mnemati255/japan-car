using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarRepairHistory
{
    /// <summary>
    /// شناسه تعمیر
    /// </summary>
    public int RepairId { get; set; }

    /// <summary>
    /// شناسه خودرو
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// شناسه قطعه
    /// </summary>
    public int PartId { get; set; }

    /// <summary>
    /// هزینه قطعه
    /// </summary>
    public decimal PartCost { get; set; }

    /// <summary>
    /// تعداد قطعه
    /// </summary>
    public int? PartCount { get; set; }

    /// <summary>
    /// شناسه مکانیک
    /// </summary>
    public int? MechanicId { get; set; }

    /// <summary>
    /// تاریخ تعمیر
    /// </summary>
    public DateOnly RepairDate { get; set; }

    /// <summary>
    /// یادداشت فنی مکانیک
    /// </summary>
    public string? MechanicTechnicalNote { get; set; }

    /// <summary>
    /// تعویض‌کننده فرمان
    /// </summary>
    public string? SteeringReplacer { get; set; }

    /// <summary>
    /// تعویض‌کننده داشبورد
    /// </summary>
    public string? DashboardReplacer { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime? CreatedDate { get; set; }

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

    public virtual Car Car { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Mechanic? Mechanic { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }

    public virtual Part Part { get; set; } = null!;
}
