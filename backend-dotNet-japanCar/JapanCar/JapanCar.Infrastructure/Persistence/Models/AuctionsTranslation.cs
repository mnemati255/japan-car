using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class AuctionsTranslation
{
    /// <summary>
    /// شناسه حراج
    /// </summary>
    public int AuctionTranslationId { get; set; }

    public int AuctionId { get; set; }

    public int LanguageId { get; set; }

    /// <summary>
    /// نام حراج
    /// </summary>
    public string AuctionName { get; set; } = null!;

    /// <summary>
    /// تاریخ برگزاری حراج
    /// </summary>
    public DateOnly AuctionDate { get; set; }

    /// <summary>
    /// کارمزد حراج
    /// </summary>
    public decimal? AuctionFee { get; set; }

    public virtual Auction Auction { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
}
