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

        public string? PurchaseDate { get; set; } = null!;

        public byte? PlateTypeTemp { get; set; }

        public byte ManufactureMonth { get; set; }

        public string? TransmissionType { get; set; }

        public bool HasInsurance { get; set; }

        public string? InsurancePolicyNumber { get; set; }

        public string? InsuranceStartDate { get; set; }

        public string? InsuranceEndDate { get; set; }

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
            
            When(x => x.HasInsurance, () => {
                RuleFor(y => y.InsurancePolicyNumber).NotEmpty();
                RuleFor(y => y.InsuranceStartDate).NotEmpty();
                RuleFor(y => y.InsuranceEndDate).NotEmpty();
            });

            RuleFor(x => x.Images)
                .NotEmpty()
                .Must(x => x != null && x.Length >= 3);
        }
    }
}
