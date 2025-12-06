using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class CarEntity
    {
        public int CarId { get; set; }

        public int BrandId { get; set; }

        public int ModelId { get; set; }

        public string ModelName { get; set; } = null!;

        public int ColorId { get; set; }

        public string ColorName { get; set; } = null!;

        public string BrandName { get; set; } = null!;

        public string ChassisNumber { get; set; } = null!;

        public int Year { get; set; }

        public int Mileage { get; set; }

        public int? EngineVolume { get; set; }

        public string? FuelType { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public int AuctionId { get; set; }

        public decimal PurchasePrice { get; set; }

        public decimal? TransportPrice { get; set; }

        public decimal? AuctionPrice { get; set; }

        public decimal? TaxAmount { get; set; }

        public decimal? FinalPrice { get; set; }

        public string[] ImageUrls { get; set; } = [];
    }
}
