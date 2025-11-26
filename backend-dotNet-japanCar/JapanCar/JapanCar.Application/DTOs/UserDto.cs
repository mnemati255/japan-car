using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public List<int> RoleIds { get; set; } = [];
    }

    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required.");
            RuleFor(x => x.RoleIds).NotEmpty().WithMessage("At least one item is required.");
        }
    }
}
