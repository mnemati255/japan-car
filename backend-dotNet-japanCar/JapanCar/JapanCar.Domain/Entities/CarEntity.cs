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
        public int? AuctionId { get; set; }
        public string? AuctionName { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal? TransportPrice { get; set; }
        public decimal? AuctionPrice { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal? FinalPrice { get; set; }
        public string[] ImageUrls { get; set; } = [];
        public decimal? ScrapCost { get; set; }
        public DateTime PurchaseDate { get; set; }
        public byte? PlateType { get; set; }
        public string? PlateNumber { get; set; }
        public byte? ManufactureMonth { get; set; }
        public string? TransmissionType { get; set; }
        public bool HasInsurance { get; set; }
        public DateTime? InsuranceEndDate { get; set; }
        public byte? ForSale { get; set; }
        public int? SukuraNumber { get; set; }
        public byte? TransportFrom { get; set; }
        public byte? TransportTo { get; set; }
        public bool? TransportConfirm { get; set; }
        public DateTime? TransportDate { get; set; }
        public DateTime? TransportDateReceived { get; set; }
        public bool? NeedsPoliceCertificate { get; set; }
        public DateTime? PoliceCertificateRequestedDate { get; set; }
        public DateTime? PoliceCertificateReceivedDate { get; set; }
        public DateTime? DeedRequestedDate { get; set; }
        public DateTime? DeedIssuedDate { get; set; }
        public DateTime? PlateRegisteredDate { get; set; }
        public bool SentToMunicipality { get; set; }
        public DateTime? MunicipalitySentDate { get; set; }
        public string? MunicipalitySentToPerson { get; set; }
        public int? MunicipalitySentByUserId { get; set; }
        public bool SentToAuction { get; set; }
        public DateTime? AuctionSentDate { get; set; }
        public string? AuctionSentToPerson { get; set; }
        public int? AuctionSentByUserId { get; set; }
        public bool PlateRevoked { get; set; }
        public DateTime? PlateRevokedDate { get; set; }
        public int? PlateRevokedByUserId { get; set; }

    }
}
