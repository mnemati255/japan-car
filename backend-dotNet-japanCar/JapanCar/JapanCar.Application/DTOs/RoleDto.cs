using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class RoleDto
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;
        public string? Description { get; set; }
        public List<int> PermissionIds { get; set; } = [];
    }

    public class RoleDtoValidator : AbstractValidator<RoleDto>
    {
        public RoleDtoValidator() {
            RuleFor(x => x.RoleName).NotEmpty().WithMessage("RoleName is required.");
            RuleFor(x => x.PermissionIds).NotEmpty().WithMessage("At least one item is required.");
        }
    }
}
