using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

/// <summary>
/// Translation table for car image types based on language.
/// </summary>
public partial class CarImageTypeTranslation
{
    /// <summary>
    /// Primary key of the car image type translation record.
    /// </summary>
    public int ImageTypeTranslationId { get; set; }

    public int ImageTypeId { get; set; }

    /// <summary>
    /// Translated title of the car image type.
    /// </summary>
    public string Title { get; set; } = null!;

    /// <summary>
    /// Language identifier of the translation.
    /// </summary>
    public int LanguageId { get; set; }

    public virtual CarImageType ImageType { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
}
