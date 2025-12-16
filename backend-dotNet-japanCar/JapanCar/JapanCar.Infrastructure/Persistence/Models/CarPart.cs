using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarPart
{
    /// <summary>
    /// CarPart Id
    /// </summary>
    public int CarPartId { get; set; }

    public int? CarRepairHistoryId { get; set; }

    /// <summary>
    /// شناسه قطعه
    /// </summary>
    public int PartId { get; set; }

    /// <summary>
    /// هزینه قطعه
    /// </summary>
    public decimal PartCost { get; set; }

    /// <summary>
    /// تعداد قطعه
    /// </summary>
    public int? PartCount { get; set; }

    /// <summary>
    /// شناسه مکانیک
    /// </summary>
    public int? MechanicId { get; set; }

    public virtual CarRepairHistory? CarRepairHistory { get; set; }

    public virtual Part Part { get; set; } = null!;
}
