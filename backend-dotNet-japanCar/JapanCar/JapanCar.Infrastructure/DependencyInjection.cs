using JapanCar.Application.Interfaces;
using JapanCar.Application.Interfaces.Security;
using JapanCar.Infrastructure.Configuration;
using JapanCar.Infrastructure.Persistence;
using JapanCar.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace JapanCar.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IPasswordHasher, PasswordHasherAdapter>();
            services.Configure<JwtSettings>(config.GetSection("Jwt"));
            services.AddScoped<IAuthService, AuthService>();
            services.AddHttpContextAccessor();
            
            return services;
        }
    }
}
