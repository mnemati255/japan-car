using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarColor
{
    /// <summary>
    /// شناسه رنگ خودرو
    /// </summary>
    public int ColorId { get; set; }

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

    public DateTime CreatedDate { get; set; }

    public virtual ICollection<CarColorTranslation> CarColorTranslations { get; set; } = new List<CarColorTranslation>();

    public virtual ICollection<Car> Cars { get; set; } = new List<Car>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }
}
