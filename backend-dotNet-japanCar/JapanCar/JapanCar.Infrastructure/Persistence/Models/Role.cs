using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Role
{
    /// <summary>
    /// شناسه نقش
    /// </summary>
    public int RoleId { get; set; }

    /// <summary>
    /// نام نقش
    /// </summary>
    public string RoleName { get; set; } = null!;

    /// <summary>
    /// توضیحات نقش
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

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
