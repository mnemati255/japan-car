using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarBrandTranslation
{
    public int CarBrandTranslationId { get; set; }

    public int LanguageId { get; set; }

    public int BrandId { get; set; }

    /// <summary>
    /// نام برند خودرو
    /// </summary>
    public string BrandName { get; set; } = null!;

    public virtual CarBrand Brand { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
}
