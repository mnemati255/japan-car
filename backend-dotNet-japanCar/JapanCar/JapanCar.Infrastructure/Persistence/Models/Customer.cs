using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Customer
{
    /// <summary>
    /// شناسه مشتری
    /// </summary>
    public int CustomerId { get; set; }

    /// <summary>
    /// نام مشتری
    /// </summary>
    public string FirstName { get; set; } = null!;

    /// <summary>
    /// نام خانوادگی مشتری
    /// </summary>
    public string LastName { get; set; } = null!;

    /// <summary>
    /// ایمیل مشتری
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// شماره تماس مشتری
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// آدرس مشتری
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// فعال/غیرفعال
    /// </summary>
    public bool IsActive { get; set; }

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

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }
}
