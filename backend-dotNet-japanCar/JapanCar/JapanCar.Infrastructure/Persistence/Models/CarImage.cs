using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarImage
{
    /// <summary>
    /// شناسه تصویر خودرو
    /// </summary>
    public int ImageId { get; set; }

    /// <summary>
    /// شناسه خودرو
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// آدرس تصویر
    /// </summary>
    public string ImageUrl { get; set; } = null!;

    /// <summary>
    /// آیا تصویر اصلی است؟
    /// </summary>
    public bool? IsPrimary { get; set; }

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

    public virtual Car Car { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }
}
