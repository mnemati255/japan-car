using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Mechanic
{
    /// <summary>
    /// شناسه مکانیک
    /// </summary>
    public int MechanicId { get; set; }

    /// <summary>
    /// نام مکانیک
    /// </summary>
    public string MechanicName { get; set; } = null!;

    /// <summary>
    /// اطلاعات تماس
    /// </summary>
    public string? Contact { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime? CreatedDate { get; set; }

    /// <summary>
    /// تاریخ ویرایش
    /// </summary>
    public DateTime? ModifiedDate { get; set; }

    /// <summary>
    /// کاربر ایجاد کننده
    /// </summary>
    public int? CreatedBy { get; set; }

    /// <summary>
    /// کاربر ویرایش کننده
    /// </summary>
    public int? ModifiedBy { get; set; }

    public virtual ICollection<CarRepairHistory> CarRepairHistories { get; set; } = new List<CarRepairHistory>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }
}
