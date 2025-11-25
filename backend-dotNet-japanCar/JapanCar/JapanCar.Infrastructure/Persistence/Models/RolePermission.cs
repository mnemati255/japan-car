using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class RolePermission
{
    /// <summary>
    /// شناسه دسترسی نقش
    /// </summary>
    public int RolePermissionId { get; set; }

    /// <summary>
    /// شناسه نقش
    /// </summary>
    public int RoleId { get; set; }

    /// <summary>
    /// شناسه دسترسی
    /// </summary>
    public int PermissionId { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime CreatedDate { get; set; }

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

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }

    public virtual Permission Permission { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
