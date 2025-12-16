using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarRepairHistoryTranslation
{
    /// <summary>
    /// CarRepairHistoryTranslation Id
    /// </summary>
    public int CarRepairHistoryTranslationId { get; set; }

    /// <summary>
    /// شناسه تعمیر
    /// </summary>
    public int RepairId { get; set; }

    /// <summary>
    /// Language Id
    /// </summary>
    public int LanguageId { get; set; }

    /// <summary>
    /// یادداشت فنی مکانیک
    /// </summary>
    public string? MechanicTechnicalNote { get; set; }

    public virtual Language Language { get; set; } = null!;

    public virtual CarRepairHistory Repair { get; set; } = null!;
}
