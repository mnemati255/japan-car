using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarImageType
{
    /// <summary>
    /// Car image type identifier (auto increment).
    /// </summary>
    public int ImageTypeId { get; set; }

    public virtual ICollection<CarImageTypeTranslation> CarImageTypeTranslations { get; set; } = new List<CarImageTypeTranslation>();

    public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();
}
