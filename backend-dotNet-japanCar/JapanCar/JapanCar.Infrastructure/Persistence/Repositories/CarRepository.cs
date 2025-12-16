using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class CarRepository : ICarRepository
    {
        private readonly AppDbContext _context;

        public CarRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task Create(CarEntity car)
        {
            var newCar = new Car
            {
                ModelId = car.ModelId,
                ColorId = car.ColorId,
                Year = car.Year,
                ChassisNumber = car.ChassisNumber,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                Mileage = car.Mileage,
                ManufactureMonth = car.ManufactureMonth,
                PlateType = car.PlateType,
                TransmissionType = car.TransmissionType,
                HasInsurance = car.HasInsurance,
                InsuranceStartDate = car.InsuranceStartDate,
                InsuranceExpireDate = car.InsuranceEndDate,
                InsurancePolicyNumber = car.InsurancePolicyNumber,
            };

            foreach (var item in car.ImageUrls)
            {
                newCar.CarImages.Add(new CarImage
                {
                    ImageUrl = item
                });
            }

            newCar.CarAuctionDetails.Add(new CarAuctionDetail
            {
                AuctionId = car.AuctionId,
                PurchasePrice = car.PurchasePrice,
                TaxAmount = car.TaxAmount,
                FinalPrice = car.FinalPrice,
                TransportPrice = car.TransportPrice,
                AuctionPrice = car.AuctionPrice,
                ScrapCost = car.ScrapCost,
                PurchaseDate = car.PurchaseDate
            });

            _context.Cars.Add(newCar);

            await _context.SaveChangesAsync();
        }


        public async Task<bool> Delete(int id)
        {
            var car = await _context.Cars
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .FirstOrDefaultAsync(x => x.CarId == id);

            if (car == null)
                return false;

            _context.CarAuctionDetails.RemoveRange(car.CarAuctionDetails);

            _context.CarImages.RemoveRange(car.CarImages);

            _context.Cars.Remove(car);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<PagedResult<CarEntity>> GetCars(int languageId, CarFilterDto filterDto, int? auctionId = null)
        {
            var query = from car in _context.Cars.AsNoTracking()
                        join cad in _context.CarAuctionDetails.AsNoTracking() on car.CarId equals cad.CarId into cadGroup
                        from cad in cadGroup.DefaultIfEmpty()
                        join color in _context.CarColors.AsNoTracking() on car.ColorId equals color.ColorId
                        join colorTr in _context.CarColorTranslations.AsNoTracking().Where(x => x.LanguageId == languageId) on color.ColorId equals colorTr.CarColorId
                        join model in _context.CarModels.AsNoTracking() on car.ModelId equals model.ModelId
                        join modelTr in _context.CarModelTranslations.AsNoTracking().Where(x => x.LanguageId == languageId) on model.ModelId equals modelTr.CarModelId
                        join brand in _context.CarBrands.AsNoTracking() on model.BrandId equals brand.BrandId
                        join brandTr in _context.CarBrandTranslations.AsNoTracking().Where(x => x.LanguageId == languageId) on brand.BrandId equals brandTr.BrandId
                        join image in _context.CarImages.AsNoTracking() on car.CarId equals image.CarId into imgs
                        select new { cad, car, color, colorTr, model, modelTr, brand, brandTr, imgs };

            if (auctionId.HasValue)
                query = query.Where(x => x.cad.AuctionId == auctionId);

            if (filterDto.BrandId.HasValue)
                query = query.Where(x => x.brand.BrandId == filterDto.BrandId.Value);

            if (filterDto.ModelId.HasValue)
                query = query.Where(x => x.model.ModelId == filterDto.ModelId.Value);

            if (filterDto.ColorId.HasValue)
                query = query.Where(x => x.color.ColorId == filterDto.ColorId.Value);

            if (filterDto.Year.HasValue)
                query = query.Where(x => x.car.Year == filterDto.Year);

            if (!string.IsNullOrEmpty(filterDto.ChasisNumber))
                query = query.Where(x => x.car.ChassisNumber.Contains(filterDto.ChasisNumber));

            if (!string.IsNullOrEmpty(filterDto.FuelType))
                query = query.Where(x => x.car.FuelType == filterDto.FuelType);

            if (filterDto.Month.HasValue)
                query = query.Where(x => x.car.ManufactureMonth == filterDto.Month);

            if (!string.IsNullOrEmpty(filterDto.TransmissionType))
                query = query.Where(x => x.car.TransmissionType == filterDto.TransmissionType);

            if (filterDto.PlateType.HasValue)
                query = query.Where(x => x.car.PlateType == filterDto.PlateType);

            if (!string.IsNullOrEmpty(filterDto.PlateNumber))
                query = query.Where(x => !string.IsNullOrEmpty(x.car.PlateNumber) && x.car.PlateNumber.Contains(filterDto.PlateNumber));

            var totalCount = await query.CountAsync();

            if (filterDto.Skip.HasValue)
                query = query.Skip(filterDto.Skip.Value);

            if (filterDto.Take.HasValue)
                query = query.Take(filterDto.Take.Value);

            var items = await query
                .Select(x => new CarEntity
                {
                    CarId = x.car.CarId,
                    AuctionId = x.cad != null ? x.cad.AuctionId : null,
                    //AuctionName = x.cad != null ? x.cad.Auction.AuctionName : null,
                    BrandName = x.brandTr.BrandName,
                    ModelName = x.modelTr.ModelName,
                    ColorName = x.colorTr.ColorName,
                    FinalPrice = x.cad != null ? x.cad.FinalPrice : 0,
                    PurchasePrice = x.cad != null ? x.cad.PurchasePrice : 0,
                    TaxAmount = x.cad != null ? x.cad.TaxAmount : 0,
                    Year = x.car.Year,
                    CreatedDate = x.car.CreatedDate,
                    ImageUrls = x.imgs.Select(i => i.ImageUrl).ToArray()
                })
                .OrderByDescending(x => x.CreatedDate).ToListAsync();


            return new PagedResult<CarEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<CarEntity?> GetById(int id, bool withAuctionDetails, bool withImages)
        {
            var query = _context.Cars
                .Include(x => x.Model)
                .Where(x => x.CarId == id);

            if (withAuctionDetails)
                query = query.Include(x => x.CarAuctionDetails);

            if (withImages)
                query = query.Include(x => x.CarImages);

            var car = await query.FirstOrDefaultAsync();

            if (car == null)
                return null;

            return new CarEntity
            {
                CarId = id,
                BrandId = car.Model.BrandId,
                ModelId = car.ModelId,
                ColorId = car.ColorId,
                Mileage = car.Mileage,
                Year = car.Year,
                ChassisNumber = car.ChassisNumber,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                PurchasePrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().PurchasePrice : 0,
                TaxAmount = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().TaxAmount : null,
                FinalPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().FinalPrice : null,
                TransportPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().TransportPrice : null,
                AuctionPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().AuctionPrice : null,
                ImageUrls = car.CarImages.Any() ? car.CarImages.Select(x => x.ImageUrl).ToArray() : [],
                PurchaseDate = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().PurchaseDate : null,
                ScrapCost = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().ScrapCost : null,
                ManufactureMonth = car.ManufactureMonth,
                HasInsurance = car.HasInsurance,
                InsuranceStartDate = car.InsuranceStartDate,
                InsuranceEndDate = car.InsuranceExpireDate,
                InsurancePolicyNumber = car.InsurancePolicyNumber,
                PlateType = car.PlateType,
                PlateNumber = car.PlateNumber,
                TransmissionType = car.TransmissionType
            };
        }


        public async Task Update(int id, CarEntity car)
        {
            var entity = await _context.Cars
                .Where(x => x.CarId == id)
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .FirstOrDefaultAsync();

            if (entity != null)
            {
                entity.ModelId = car.ModelId;
                entity.ColorId = car.ColorId;
                entity.Year = car.Year;
                entity.ChassisNumber = car.ChassisNumber;
                entity.EngineVolume = car.EngineVolume;
                entity.FuelType = car.FuelType;
                entity.Mileage = car.Mileage;
                entity.ManufactureMonth = car.ManufactureMonth;
                entity.PlateType = car.PlateType;
                entity.PlateNumber = car.PlateNumber;
                entity.TransmissionType = car.TransmissionType;
                entity.HasInsurance = car.HasInsurance;
                entity.InsuranceStartDate = car.InsuranceStartDate;
                entity.InsuranceExpireDate = car.InsuranceEndDate;
                entity.InsurancePolicyNumber = car.InsurancePolicyNumber;

                _context.CarAuctionDetails.RemoveRange(entity.CarAuctionDetails);
                _context.CarImages.RemoveRange(entity.CarImages);

                foreach (var item in car.ImageUrls)
                {
                    entity.CarImages.Add(new CarImage
                    {
                        ImageUrl = item
                    });
                }

                if (entity.CarAuctionDetails.Any())
                {
                    entity.CarAuctionDetails.Add(new CarAuctionDetail
                    {
                        AuctionId = entity.CarAuctionDetails.First().AuctionId,
                        PurchasePrice = car.PurchasePrice,
                        TaxAmount = car.TaxAmount,
                        FinalPrice = car.FinalPrice,
                        TransportPrice = car.TransportPrice,
                        AuctionPrice = car.AuctionPrice,
                        ScrapCost = car.ScrapCost,
                        PurchaseDate = car.PurchaseDate
                    });
                }

                await _context.SaveChangesAsync();
            }
        }


        public async Task<bool> ExistsCar(int carId)
        {
            var isExists = await _context.Cars
                .Where(x => x.CarId == carId)
                .AnyAsync();

            return isExists;
        }
    }
}
