using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarColorTranslation
{
    public int CarColorTranslationId { get; set; }

    public int LanguageId { get; set; }

    public int CarColorId { get; set; }

    public string ColorName { get; set; } = null!;

    public virtual CarColor CarColor { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
}
