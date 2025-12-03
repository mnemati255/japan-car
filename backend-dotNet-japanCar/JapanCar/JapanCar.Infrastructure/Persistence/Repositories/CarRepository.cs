using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Drawing;
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
                TechnicalTestResult = car.TechnicalTestResult,
                UsageStatus = car.UsageStatus,
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
            });

            _context.Cars.Add(newCar);

            await _context.SaveChangesAsync();
        }


        public async Task Delete(int id)
        {
            var car = await _context.Cars
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .Where(x => x.CarId == id)
                .SingleAsync();

            _context.CarAuctionDetails.RemoveRange(car.CarAuctionDetails);

            _context.CarImages.RemoveRange(car.CarImages);

            _context.Cars.Remove(car);

            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<CarEntity>> GetAll()
        {
            return await _context.Cars
                .Include(x => x.Model)
                .ThenInclude(x => x.Brand)
                .Include(x => x.Color)
                .Select(e => new CarEntity
                {
                    Mileage = e.Mileage,
                    Year = e.Year,
                    ColorName = e.Color.ColorName,
                    ModelName = e.Model.ModelName,
                }).ToListAsync();
        }


        public async Task<IEnumerable<CarEntity>> GetAllCarsOfAuction(int auctionId)
        {
            var query = from cad in _context.CarAuctionDetails
                        join car in _context.Cars on cad.CarId equals car.CarId
                        join color in _context.CarColors on car.ColorId equals color.ColorId
                        join model in _context.CarModels on car.ModelId equals model.ModelId
                        join brand in _context.CarBrands on model.BrandId equals brand.BrandId
                        join image in _context.CarImages on car.CarId equals image.CarId into imgs
                        where cad.AuctionId == auctionId
                        select new CarEntity
                        {
                            CarId = car.CarId,
                            AuctionId = auctionId,
                            BrandName = brand.BrandName,
                            ModelName = model.ModelName,
                            ColorName = color.ColorName,
                            FinalPrice = cad.FinalPrice,
                            PurchasePrice = cad.PurchasePrice,
                            TaxAmount = cad.TaxAmount,
                            Year = car.Year,
                            CreatedDate = cad.CreatedDate,
                            ImageUrls = imgs.Select(x => x.ImageUrl).ToArray()
                        };

            return await query.ToListAsync();
        }


        public async Task<CarEntity?> GetById(int id, bool withAuctionDetails, bool withImages)
        {
            var query = _context.Cars.Where(x => x.CarId == id);

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
                ModelId = car.ModelId,
                ColorId = car.ColorId,
                Mileage = car.Mileage,
                Year = car.Year,
                ChassisNumber = car.ChassisNumber,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                TechnicalTestResult = car.TechnicalTestResult,
                UsageStatus = car.UsageStatus,
                PurchasePrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.ToList()[0].PurchasePrice : 0,
                TaxAmount = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.ToList()[0].TaxAmount : null,
                FinalPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.ToList()[0].FinalPrice : null,
                ImageUrls = car.CarImages.Any() ? car.CarImages.Select(x => x.ImageUrl).ToArray() : []
            };
        }


        public async Task Update(int id, CarEntity car)
        {
            var entity = await _context.Cars
                .Where(x => x.CarId == id)
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .FirstOrDefaultAsync();

            if(entity != null)
            {
                entity.ModelId = car.ModelId;
                entity.ColorId = car.ColorId;
                entity.Year = car.Year;
                entity.ChassisNumber = car.ChassisNumber;
                entity.EngineVolume = car.EngineVolume;
                entity.FuelType = car.FuelType;
                entity.Mileage = car.Mileage;
                entity.TechnicalTestResult = car.TechnicalTestResult;
                entity.UsageStatus = car.UsageStatus;

                _context.CarAuctionDetails.RemoveRange(entity.CarAuctionDetails);
                _context.CarImages.RemoveRange(entity.CarImages);

                foreach (var item in car.ImageUrls)
                {
                    entity.CarImages.Add(new CarImage
                    {
                        ImageUrl = item
                    });
                }

                entity.CarAuctionDetails.Add(new CarAuctionDetail
                {
                    AuctionId = car.AuctionId,
                    PurchasePrice = car.PurchasePrice,
                    TaxAmount = car.TaxAmount,
                    FinalPrice = car.FinalPrice,
                });

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
