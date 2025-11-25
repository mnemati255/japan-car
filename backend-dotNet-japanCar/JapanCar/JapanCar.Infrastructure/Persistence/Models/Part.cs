using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Part
{
    /// <summary>
    /// شناسه قطعه
    /// </summary>
    public int PartId { get; set; }

    /// <summary>
    /// نام قطعه
    /// </summary>
    public string PartName { get; set; } = null!;

    /// <summary>
    /// توضیحات قطعه
    /// </summary>
    public string? PartDescription { get; set; }

    /// <summary>
    /// قیمت قطعه
    /// </summary>
    public decimal PartPrice { get; set; }

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
