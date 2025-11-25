using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Auction
{
    /// <summary>
    /// شناسه حراج
    /// </summary>
    public int AuctionId { get; set; }

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

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// تاریخ ویرایش
    /// </summary>
    public DateTime? ModifiedDate { get; set; }

    /// <summary>
    /// ایجاد شده توسط
    /// </summary>
    public int CreatedBy { get; set; }

    /// <summary>
    /// ویرایش شده توسط
    /// </summary>
    public int? ModifiedBy { get; set; }

    public virtual ICollection<CarAuctionDetail> CarAuctionDetails { get; set; } = new List<CarAuctionDetail>();

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual User? ModifiedByNavigation { get; set; }
}
