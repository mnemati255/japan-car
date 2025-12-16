using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class PartTranslation
{
    /// <summary>
    /// PartTranslation Id
    /// </summary>
    public int PartTranslationId { get; set; }

    /// <summary>
    /// شناسه قطعه
    /// </summary>
    public int PartId { get; set; }

    /// <summary>
    /// Language Id
    /// </summary>
    public int LanguageId { get; set; }

    /// <summary>
    /// نام قطعه
    /// </summary>
    public string PartName { get; set; } = null!;

    /// <summary>
    /// توضیحات قطعه
    /// </summary>
    public string? PartDescription { get; set; }

    public virtual Language Language { get; set; } = null!;

    public virtual Part Part { get; set; } = null!;
}
