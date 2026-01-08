using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

/// <summary>
/// Records car sale transactions and sale history
/// </summary>
public partial class CarSale
{
    /// <summary>
    /// Primary key identifier for the car sale record
    /// </summary>
    public int CarSaleId { get; set; }

    /// <summary>
    /// Reference to the sold car
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// Reference to the buyer (person or customer)
    /// </summary>
    public int BuyerId { get; set; }

    /// <summary>
    /// Date when the car was sold
    /// </summary>
    public DateOnly SaleDate { get; set; }

    /// <summary>
    /// Final sale price of the car
    /// </summary>
    public decimal? SalePrice { get; set; }

    /// <summary>
    /// Indicates whether the sale record is active (used for soft delete or cancellation)
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Date and time when the sale record was created
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// User or system that created the sale record
    /// </summary>
    public int CreatedBy { get; set; }

    public virtual Customer Buyer { get; set; } = null!;

    public virtual Car Car { get; set; } = null!;

    public virtual User CreatedByNavigation { get; set; } = null!;
}
