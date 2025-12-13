using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class CarAuctionDetail
{
    /// <summary>
    /// شناسه حراج خودرو
    /// </summary>
    public int CarAuctionId { get; set; }

    /// <summary>
    /// شناسه خودرو
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// شناسه حراج
    /// </summary>
    public int? AuctionId { get; set; }

    /// <summary>
    /// قیمت خرید
    /// </summary>
    public decimal PurchasePrice { get; set; }

    /// <summary>
    /// مبلغ مالیات
    /// </summary>
    public decimal? TransportPrice { get; set; }

    /// <summary>
    /// مبلغ مالیات
    /// </summary>
    public decimal? AuctionPrice { get; set; }

    /// <summary>
    /// مبلغ مالیات
    /// </summary>
    public decimal? TaxAmount { get; set; }

    /// <summary>
    /// قیمت نهایی
    /// </summary>
    public decimal? FinalPrice { get; set; }

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
    public int? CreatedBy { get; set; }

    /// <summary>
    /// ویرایش شده توسط
    /// </summary>
    public int? ModifiedBy { get; set; }

    public virtual Auction? Auction { get; set; }

    public virtual Car Car { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? ModifiedByNavigation { get; set; }
}
