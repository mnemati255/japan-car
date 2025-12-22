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
    /// شناسه مکانیک
    /// </summary>
    public int? MechanicId { get; set; }

    /// <summary>
    /// تاریخ تعمیر
    /// </summary>
    public DateOnly RepairDate { get; set; }

    /// <summary>
    /// تعویض‌کننده فرمان
    /// </summary>
    public int? SteeringReplacerId { get; set; }

    /// <summary>
    /// تعویض‌کننده داشبورد
    /// </summary>
    public int? DashboardReplacerId { get; set; }

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

    /// <summary>
    /// Mechanic Work Hours
    /// </summary>
    public decimal? MechanicWorkHours { get; set; }

    /// <summary>
    /// Mechanic Labor Cost
    /// </summary>
    public decimal? MechanicLaborCost { get; set; }

    public virtual Car Car { get; set; } = null!;

    public virtual ICollection<CarPart> CarParts { get; set; } = new List<CarPart>();

    public virtual ICollection<CarRepairHistoryTranslation> CarRepairHistoryTranslations { get; set; } = new List<CarRepairHistoryTranslation>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Mechanic? DashboardReplacer { get; set; }

    public virtual Mechanic? Mechanic { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }

    public virtual Mechanic? SteeringReplacer { get; set; }
}
