using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
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


        public async Task<PagedResult<CarColorEntity>> GetColors(string? keyword, int? skip = null, int? take = null)
        {
            var query = _context.CarColors.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.ColorName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new CarColorEntity
            {
                ColorId = x.ColorId,
                ColorName = x.ColorName,
                CreatedDate = x.CreatedDate
            }).ToListAsync();

            return new PagedResult<CarColorEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<PagedResult<CarBrandEntity>> GetBrands(string? keyword, int? skip = null, int? take = null)
        {
            var query = _context.CarBrands.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.BrandName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new CarBrandEntity
            {
                BrandId = x.BrandId,
                BrandName = x.BrandName,
                CreatedDate = x.CreatedDate
            }).ToListAsync();

            return new PagedResult<CarBrandEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<PagedResult<CarModelEntity>> GetModels(string? keyword, int? skip = null, int? take = null)
        {
            var query = _context.CarModels
                .Include(x => x.Brand)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.ModelName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new CarModelEntity
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
                BrandName = x.Brand.BrandName,
                CreatedDate = x.CreatedDate
            }).ToListAsync();

            return new PagedResult<CarModelEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<IEnumerable<CarModelEntity>> GetModelsOfBrands(int brandId)
        {
            var models = await _context.CarModels
                .Where(x => x.BrandId == brandId)
                .ToListAsync();

            return models.Select(x => new CarModelEntity
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
                CreatedDate = x.CreatedDate
            });
        }


        public async Task CreateBrand(CarBrandEntity entity)
        {
            var brand = new CarBrand
            {
                BrandName = entity.BrandName,
            };

            _context.CarBrands.Add(brand);

            await _context.SaveChangesAsync();
        }


        public async Task CreateColor(CarColorEntity entity)
        {
            var color = new CarColor
            {
                ColorName = entity.ColorName,
            };

            _context.CarColors.Add(color);

            await _context.SaveChangesAsync();
        }


        public async Task CreateModel(CarModelEntity entity)
        {
            var model = new CarModel
            {
                ModelName = entity.ModelName,
                BrandId = entity.BrandId,
            };

            _context.CarModels.Add(model);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateBrand(int id, CarBrandEntity entity)
        {
            var brand = await _context.CarBrands.FirstOrDefaultAsync(x => x.BrandId == id);
            if (brand != null)
            {
                brand.BrandName = entity.BrandName;
                brand.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }

        }

        public async Task UpdateColor(int id, CarColorEntity entity)
        {
            var color = await _context.CarColors.FirstOrDefaultAsync(x => x.ColorId == id);
            if (color != null)
            {
                color.ColorName = entity.ColorName;
                color.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateModel(int id, CarModelEntity entity)
        {
            var model = await _context.CarModels.FirstOrDefaultAsync(x => x.ModelId == id);
            if (model != null)
            {
                model.BrandId = entity.BrandId;
                model.ModelName = entity.ModelName;
                model.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteBrand(int id)
        {
            var brand = await _context.CarBrands
                .Include(x => x.CarModels)
                .FirstOrDefaultAsync(x => x.BrandId == id);

            if (brand != null)
            {
                _context.CarModels.RemoveRange(brand.CarModels);
                _context.CarBrands.Remove(brand);

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteColor(int id)
        {
            var color = await _context.CarColors
                .Include(x => x.Cars)
                .FirstOrDefaultAsync(x => x.ColorId == id);

            if (color != null)
            {
                _context.Cars.RemoveRange(color.Cars);
                _context.CarColors.Remove(color);

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteModel(int id)
        {
            var model = await _context.CarModels
                .Include(x => x.Cars)
                .FirstOrDefaultAsync(x => x.ModelId == id);

            if (model != null)
            {
                _context.Cars.RemoveRange(model.Cars);
                _context.CarModels.Remove(model);

                await _context.SaveChangesAsync();
            }
        }
    }
}
