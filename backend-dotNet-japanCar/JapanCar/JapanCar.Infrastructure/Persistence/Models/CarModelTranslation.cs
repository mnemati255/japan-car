using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarModelTranslation
{
    public int CarModelTranslationId { get; set; }

    public int CarModelId { get; set; }

    /// <summary>
    /// نام مدل خودرو
    /// </summary>
    public string ModelName { get; set; } = null!;

    public int LanguageId { get; set; }

    public virtual CarModel CarModel { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
}
