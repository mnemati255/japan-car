using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class BaseInfoRepository : IBaseInfoRepository
    {
        private readonly AppDbContext _context;

        public BaseInfoRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<PagedResult<CarColorEntity>> GetColors(int languageId, string? keyword, int? skip = null, int? take = null)
        {
            var query = from c in _context.CarColors.AsNoTracking()
                        join cTr in _context.CarColorTranslations.AsNoTracking() on c.ColorId equals cTr.CarColorId
                        where cTr.LanguageId == languageId
                        select new { c, cTr };

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.cTr.ColorName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new CarColorEntity
            {
                ColorId = x.c.ColorId,
                ColorName = x.cTr.ColorName,
                CreatedDate = x.c.CreatedDate
            }).ToListAsync();

            return new PagedResult<CarColorEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<PagedResult<CarBrandEntity>> GetBrands(int languageId, string? keyword, int? skip = null, int? take = null)
        {
            var query = from b in _context.CarBrands.AsNoTracking()
                        join bTr in _context.CarBrandTranslations.AsNoTracking() on b.BrandId equals bTr.BrandId
                        where bTr.LanguageId == languageId
                        select new { b, bTr };

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.bTr.BrandName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new CarBrandEntity
            {
                BrandId = x.b.BrandId,
                BrandName = x.bTr.BrandName,
                CreatedDate = x.b.CreatedDate
            }).ToListAsync();

            return new PagedResult<CarBrandEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<PagedResult<CarModelEntity>> GetModels(int languageId, string? keyword, int? skip = null, int? take = null)
        {
            var query = from m in _context.CarModels.AsNoTracking()
                        join mTr in _context.CarModelTranslations.AsNoTracking() on m.ModelId equals mTr.CarModelId
                        join b in _context.CarBrands.AsNoTracking() on m.BrandId equals b.BrandId
                        join bTr in _context.CarBrandTranslations.AsNoTracking() on m.BrandId equals bTr.BrandId
                        where mTr.LanguageId == languageId && bTr.LanguageId == languageId
                        select new { m, mTr, b, bTr };

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.mTr.ModelName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new CarModelEntity
            {
                ModelId = x.m.ModelId,
                BrandId = x.m.BrandId,
                ModelName = x.mTr.ModelName,
                BrandName = x.bTr.BrandName,
                CreatedDate = x.m.CreatedDate
            }).ToListAsync();

            return new PagedResult<CarModelEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<IEnumerable<CarModelEntity>> GetModelsOfBrands(int languageId, int brandId)
        {
            var query = from m in _context.CarModels.AsNoTracking()
                        join mTr in _context.CarModelTranslations.AsNoTracking() on m.ModelId equals mTr.CarModelId
                        where m.BrandId == brandId && mTr.LanguageId == languageId
                        select new CarModelEntity
                        {
                            ModelId = m.ModelId,
                            BrandId = m.BrandId,
                            ModelName = mTr.ModelName,
                            CreatedDate = m.CreatedDate
                        };

            return await query.ToListAsync();
        }


        public async Task<CarColorEntity?> GetColorById(int languageId, int id)
        {
            var entity = await _context.CarColors
                .Where(x => x.ColorId == id)
                .Select(c => new
                {
                    c,
                    tr = c.CarColorTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstAsync();

            return new CarColorEntity
            {
                ColorId = id,
                ColorName = entity.tr != null ? entity.tr.ColorName : "",
            };
        }


        public async Task<CarBrandEntity?> GetBrandById(int languageId, int id)
        {
            var entity = await _context.CarBrands
                .Where(x => x.BrandId == id)
                .Select(b => new
                {
                    b,
                    tr = b.CarBrandTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstAsync();

            return new CarBrandEntity
            {
                BrandId = id,
                BrandName = entity.tr != null ? entity.tr.BrandName : "",
            };
        }


        public async Task<CarModelEntity?> GetModelById(int languageId, int id)
        {
            var entity = await _context.CarModels
                .Where(x => x.ModelId == id)
                .Select(m => new
                {
                    m,
                    tr = m.CarModelTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstAsync();

            return new CarModelEntity
            {
                ModelId = id,
                BrandId = entity.m.BrandId,
                ModelName = entity.tr != null ? entity.tr.ModelName : "",
            };
        }


        public async Task CreateBrand(int languageId, CarBrandEntity entity)
        {
            var brand = new CarBrand();

            brand.CarBrandTranslations.Add(new CarBrandTranslation
            {
                BrandName = entity.BrandName,
                LanguageId = languageId
            });

            _context.CarBrands.Add(brand);

            await _context.SaveChangesAsync();
        }


        public async Task CreateColor(int languageId, CarColorEntity entity)
        {
            try
            {
                var color = new CarColor();

                color.CarColorTranslations.Add(new CarColorTranslation
                {
                    ColorName = entity.ColorName,
                    LanguageId = languageId
                });

                _context.CarColors.Add(color);

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {

                throw;
            }
        }


        public async Task CreateModel(int languageId, CarModelEntity entity)
        {
            var model = new CarModel
            {
                BrandId = entity.BrandId,
            };

            model.CarModelTranslations.Add(new CarModelTranslation
            {
                ModelName = entity.ModelName,
                LanguageId = languageId,
            });

            _context.CarModels.Add(model);

            await _context.SaveChangesAsync();
        }


        public async Task UpdateBrand(int languageId, int id, CarBrandEntity entity)
        {
            var brand = await _context.CarBrands
                .Where(x => x.BrandId == id)
                .Select(b => new
                {
                    b,
                    tr = b.CarBrandTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstOrDefaultAsync(b => b.b.BrandId == id);

            if (brand != null)
            {
                if (brand.tr != null)
                {
                    brand.tr.BrandName = entity.BrandName;
                }
                else
                {
                    brand.b.CarBrandTranslations.Add(new CarBrandTranslation
                    {
                        BrandName = entity.BrandName,
                        LanguageId = languageId
                    });
                }

                brand.b.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }

        }


        public async Task UpdateColor(int languageId, int id, CarColorEntity entity)
        {
            var color = await _context.CarColors
                .Where(x => x.ColorId == id)
                .Select(c => new
                {
                    c,
                    tr = c.CarColorTranslations.First(t => t.LanguageId == languageId)
                }).FirstOrDefaultAsync();

            if (color != null)
            {
                if (color.tr != null)
                {
                    color.tr.ColorName = entity.ColorName;
                }
                else
                {
                    color.c.CarColorTranslations.Add(new CarColorTranslation
                    {
                        ColorName = entity.ColorName,
                        LanguageId = languageId
                    });
                }

                color.c.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }
        }


        public async Task UpdateModel(int languageId, int id, CarModelEntity entity)
        {
            var model = await _context.CarModels
                .Where(x => x.ModelId == id)
                .Select(m => new
                {
                    m,
                    tr = m.CarModelTranslations.First(t => t.LanguageId == languageId)
                }).FirstOrDefaultAsync();

            if (model != null)
            {
                if (model.tr != null)
                {
                    model.tr.ModelName = entity.ModelName;
                }
                else
                {
                    model.m.CarModelTranslations.Add(new CarModelTranslation
                    {
                        ModelName = entity.ModelName,
                        LanguageId = languageId
                    });
                }

                model.m.BrandId = entity.BrandId;
                model.m.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }
        }


        public async Task DeleteBrand(int id)
        {
            var brand = await _context.CarBrands
                .Include(x => x.CarBrandTranslations)
                .Include(x => x.CarModels)
                .FirstOrDefaultAsync(x => x.BrandId == id);

            if (brand != null)
            {
                _context.CarBrandTranslations.RemoveRange(brand.CarBrandTranslations);
                _context.CarModels.RemoveRange(brand.CarModels);
                _context.CarBrands.Remove(brand);

                await _context.SaveChangesAsync();
            }
        }


        public async Task DeleteColor(int id)
        {
            var color = await _context.CarColors
                .Include(x => x.CarColorTranslations)
                .Include(x => x.Cars)
                .FirstOrDefaultAsync(x => x.ColorId == id);

            if (color != null)
            {
                _context.CarColorTranslations.RemoveRange(color.CarColorTranslations);
                _context.Cars.RemoveRange(color.Cars);
                _context.CarColors.Remove(color);

                await _context.SaveChangesAsync();
            }
        }


        public async Task DeleteModel(int id)
        {
            var model = await _context.CarModels
                .Include(x => x.CarModelTranslations)
                .Include(x => x.Cars)
                .FirstOrDefaultAsync(x => x.ModelId == id);

            if (model != null)
            {
                _context.CarModelTranslations.RemoveRange(model.CarModelTranslations);
                _context.Cars.RemoveRange(model.Cars);
                _context.CarModels.Remove(model);

                await _context.SaveChangesAsync();
            }
        }
    }
}
