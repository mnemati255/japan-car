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

    public virtual Auction Auction { get; set; } = null!;

    public virtual Language Language { get; set; } = null!;
}
