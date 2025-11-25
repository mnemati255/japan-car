using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Permission
{
    /// <summary>
    /// شناسه دسترسی
    /// </summary>
    public int PermissionId { get; set; }

    /// <summary>
    /// نام دسترسی
    /// </summary>
    public string PermissionName { get; set; } = null!;

    /// <summary>
    /// توضیحات دسترسی
    /// </summary>
    public string? Description { get; set; }

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

    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
