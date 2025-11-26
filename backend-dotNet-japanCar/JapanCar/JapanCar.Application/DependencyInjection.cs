using FluentValidation;
using JapanCar.Application.DTOs;
using JapanCar.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<CarService>();
            services.AddScoped<UserService>();
            services.AddScoped<RoleService>();

            services.AddScoped<IValidator<RoleDto>, RoleDtoValidator>();
            services.AddScoped<IValidator<UserDto>, UserDtoValidator>();

            return services;
        }
    }
}
