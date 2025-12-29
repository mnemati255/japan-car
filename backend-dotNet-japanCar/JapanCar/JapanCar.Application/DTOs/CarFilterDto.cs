using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class CarFilterDto
    {
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public int? BrandId { get; set; }
        public int? ModelId { get; set; }
        public int? ColorId { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public string? Katashaki { get; set; }
        public string? ChasisNumber { get; set; }
        public string? FuelType { get; set; }
        public string? TransmissionType { get; set; }
        public byte? PlateType { get; set; }
        public string? PlateNumber { get; set; }
        public string? PurchaseDateFrom { get; set; }
        public string? PurchaseDateTo { get; set; }
        public int? PurchasePriceFrom { get; set; }
        public int? PurchasePriceTo { get; set; }
        public string? TransportDateFrom { get; set; }
        public string? TransportDateTo { get; set; }
        public string? HasPoliceCertificate { get; set; }
        public string? PoliceCertificateReceivedDateFrom { get; set; }
        public string? PoliceCertificateReceivedDateTo { get; set; }
        public string? MunicipalitySentDateFrom { get; set; }
        public string? MunicipalitySentDateTo { get; set; }

    }
}
