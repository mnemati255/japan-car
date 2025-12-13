using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Language
{
    /// <summary>
    /// شناسه زبان
    /// </summary>
    public int LanguageId { get; set; }

    /// <summary>
    /// کد زبان
    /// </summary>
    public string Code { get; set; } = null!;

    /// <summary>
    /// نام زبان
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// تاریخ ویرایش
    /// </summary>
    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<CarBrandTranslation> CarBrandTranslations { get; set; } = new List<CarBrandTranslation>();

    public virtual ICollection<CarColorTranslation> CarColorTranslations { get; set; } = new List<CarColorTranslation>();

    public virtual ICollection<CarModelTranslation> CarModelTranslations { get; set; } = new List<CarModelTranslation>();

    public virtual ICollection<GenericTranslation> GenericTranslations { get; set; } = new List<GenericTranslation>();
}
