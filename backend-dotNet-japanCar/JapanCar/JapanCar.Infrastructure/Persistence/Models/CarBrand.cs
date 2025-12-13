using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarBrand
{
    /// <summary>
    /// شناسه برند خودرو
    /// </summary>
    public int BrandId { get; set; }

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

    public virtual ICollection<CarBrandTranslation> CarBrandTranslations { get; set; } = new List<CarBrandTranslation>();

    public virtual ICollection<CarModel> CarModels { get; set; } = new List<CarModel>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }
}
