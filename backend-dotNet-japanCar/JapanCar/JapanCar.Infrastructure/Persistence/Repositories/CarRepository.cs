using JapanCar.Application.Interfaces;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class CarRepository : ICarRepository
    {
        private readonly AppDbContext _context;

        public CarRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Domain.Entities.Car>> GetAllCars()
        {
            return await _context.Cars
                .Include(x => x.Model)
                .ThenInclude(x => x.Brand)
                .Include(x => x.Color)
                .Select(e => new Domain.Entities.Car
                {
                    Mileage = e.Mileage,
                    Year = e.Year,
                    Color = new Domain.Entities.CarColor { ColorName = e.Color.ColorName },
                    Model = new Domain.Entities.CarModel { ModelName = e.Model.ModelName, Brand = new Domain.Entities.CarBrand { BrandName = e.Model.Brand.BrandName } },
                }).ToListAsync();
        }
    }
}
