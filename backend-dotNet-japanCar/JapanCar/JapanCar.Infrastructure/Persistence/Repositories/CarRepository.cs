using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
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

        public async Task<IEnumerable<Car>> GetAll()
        {
            return await _context.Cars
                .Include(x => x.Model)
                .ThenInclude(x => x.Brand)
                .Include(x => x.Color)
                .Select(e => new Car
                {
                    Mileage = e.Mileage,
                    Year = e.Year,
                    Color = new CarColor { ColorName = e.Color.ColorName },
                    Model = new CarModel { ModelName = e.Model.ModelName, Brand = new Domain.Entities.CarBrand { BrandName = e.Model.Brand.BrandName } },
                }).ToListAsync();
        }
    }
}
