using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class AuctionDto
    {
        public int AuctionId { get; set; }
        public string AuctionName { get; set; } = null!;
        public string AuctionDate { get; set; } = null!;
        public decimal? AuctionFee { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class AuctionDtoValidator: AbstractValidator<AuctionDto>
    {
        public AuctionDtoValidator()
        {
            RuleFor(x => x.AuctionName).NotEmpty().WithMessage("Auction name is required");
            RuleFor(x => x.AuctionDate).NotEmpty().WithMessage("Auction date is required");
        }
    }
}
