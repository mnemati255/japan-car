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
        public DateTime? CreatedAt { get; set; }
    }

    public class AuctionDtoValidator: AbstractValidator<AuctionDto>
    {
        public AuctionDtoValidator()
        {
            RuleFor(x => x.AuctionName).NotEmpty().WithMessage("Auction name is required");
        }
    }
}
