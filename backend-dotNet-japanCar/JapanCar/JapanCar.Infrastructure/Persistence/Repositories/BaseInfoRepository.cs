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
    public class BaseInfoRepository : IBaseInfoRepository
    {
        private readonly AppDbContext _context;

        public BaseInfoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CarColorEntity>> GetCarColors()
        {
            var colors = await _context.CarColors.ToListAsync();
            return colors.Select(x => new CarColorEntity
            {
                ColorId = x.ColorId,
                ColorName = x.ColorName,
                CreatedDate = x.CreatedDate
            });
        }

        public async Task<IEnumerable<CarModelEntity>> GetCarModels()
        {
            var models = await _context.CarModels.ToListAsync();
            return models.Select(x => new CarModelEntity
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
                CreatedDate = x.CreatedDate
            });
        }
    }
}
