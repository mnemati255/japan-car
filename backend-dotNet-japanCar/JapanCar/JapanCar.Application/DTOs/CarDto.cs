using FluentValidation;

namespace JapanCar.Application.DTOs
{
    public class CarDto
    {
        public int CarId { get; set; }
        public int? AuctionId { get; set; }
        public string? AuctionName { get; set; }
        public int? BrandId { get; set; }
        public int ColorId { get; set; }
        public int ModelId { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }
        public int? EngineVolume { get; set; }
        public string? FuelType { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal? TransportPrice { get; set; }
        public decimal? AuctionPrice { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal? FinalPrice { get; set; }
        public string ChasisNumber { get; set; } = null!;
        public string? ModelName { get; set; }
        public string? ColorName { get; set; }
        public string? BrandName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string[] Images { get; set; } = [];
        public decimal? ScrapCost { get; set; }
        public string PurchaseDate { get; set; } = null!;
        public byte? PlateType { get; set; }
        public string? PlateNumber { get; set; }
        public byte ManufactureMonth { get; set; }
        public string? TransmissionType { get; set; }
        public bool HasInsurance { get; set; }
        public string? InsuranceEndDate { get; set; }
        public byte? ForSale { get; set; }
        public int? SukuraNumber { get; set; }
        public byte? TransportFrom { get; set; }
        public byte? TransportTo { get; set; }
        public bool? TransportConfirm { get; set; }
        public string? TransportDate { get; set; }
        public string? TransportDateReceived { get; set; }
        public bool? NeedsPoliceCertificate { get; set; }
        public string? PoliceCertificateRequestedDate { get; set; }
        public string? PoliceCertificateReceivedDate { get; set; }
        public string? DeedRequestedDate { get; set; }
        public string? DeedIssuedDate { get; set; }
        public string? PlateRegisteredDate { get; set; }
        public bool SentToMunicipality { get; set; }
        public string? MunicipalitySentDate { get; set; }
        public string? MunicipalitySentToPerson { get; set; }
        public bool SentToAuction { get; set; }
        public string? AuctionSentDate { get; set; }
        public string? AuctionSentToPerson { get; set; }
        public bool PlateRevoked { get; set; }
        public string? PlateRevokedDate { get; set; }
        public string? Grad { get; set; }
        public string? Point { get; set; }
        public int? TransportConfirmUserId { get; set; }
        public int? PoliceCertificateNumber { get; set; }
        public int? ActionNumber { get; set; }
        public string? Katashaki { get; set; }
        public string? ActionDeadlineDate { get; set; }
        public string? MunicipalityDeadlineDate { get; set; }
        public string? PlateRevokedDeadLine { get; set; }
    }

    public class CarDtoValidator : AbstractValidator<CarDto>
    {
        public CarDtoValidator()
        {
            RuleFor(x => x.ColorId).NotEmpty().WithMessage("Color is required.");
            
            RuleFor(x => x.ModelId).NotEmpty().WithMessage("Model is required.");
            
            RuleFor(x => x.Year).NotEmpty().WithMessage("Year is required.");
            
            RuleFor(x => x.ManufactureMonth).NotEmpty().WithMessage("Month is required.");
            
            RuleFor(x => x.Mileage).NotEmpty().WithMessage("Mileage is required.");
            
            RuleFor(x => x.ChasisNumber).NotEmpty().WithMessage("Chasis number is required.");

            RuleFor(x => x.PurchaseDate).NotEmpty();

            When(x => x.HasInsurance, () => {
                RuleFor(y => y.InsuranceEndDate).NotEmpty();
            });

            RuleFor(x => x.Images)
                .NotEmpty()
                .Must(x => x != null && x.Length >= 3);
        }
    }
}
