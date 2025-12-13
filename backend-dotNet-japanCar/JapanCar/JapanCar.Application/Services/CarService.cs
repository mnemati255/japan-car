using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Common;
using JapanCar.Domain.Entities;
using System.Reflection;

namespace JapanCar.Application.Services
{
    public class CarService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorage _fileStorage;
        private readonly IRequestContext _requestContext;

        public CarService(
            IUnitOfWork unitOfWork, 
            IFileStorage fileStorage, 
            LanguageService languageService,
            IRequestContext requestContext
            ) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _fileStorage = fileStorage;
            _requestContext = requestContext;
        }


        public async Task<GridDto<CarDto>> GetAllCars(CarFilterDto filterDto, int? auctionId = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.CarRepository.GetCars(languageId, filterDto, auctionId);

            var cars = entities.Items.Select(x => new CarDto
            {
                CarId = x.CarId,
                AuctionId = x.AuctionId,
                AuctionName = x.AuctionName,
                BrandName = x.BrandName,
                ModelName = x.ModelName,
                ColorName = x.ColorName,
                FinalPrice = x.FinalPrice,
                PurchasePrice = x.PurchasePrice,
                TaxAmount = x.TaxAmount,
                TransportPrice = x.TransportPrice,
                AuctionPrice = x.AuctionPrice,
                Year = x.Year,
                CreatedAt = x.CreatedDate,
                Images = x.ImageUrls
            });

            var totalPage = 0;

            if (filterDto.Take.HasValue)
            {
                var tp = int.Parse(Math.Floor(decimal.Divide(entities.TotalCount, Convert.ToDecimal(filterDto.Take))).ToString());
                totalPage = tp + 1;
            }

            return new GridDto<CarDto>
            {
                Items = cars,
                TotalPage = totalPage
            };
        }


        public async Task CreateCar(CarDto dto, List<FileData> images)
        {
            var savedNames = await _fileStorage.SaveFilesAsync(images, Constants.CARS_IMAGES_FOLDER);

            await _unitOfWork.CarRepository.Create(new CarEntity
            {
                AuctionId = dto.AuctionId,
                ChassisNumber = dto.ChasisNumber,
                ColorId = dto.ColorId,
                EngineVolume = dto.EngineVolume,
                FinalPrice = dto.FinalPrice,
                FuelType = dto.FuelType,
                ImageUrls = savedNames.ToArray(),
                Mileage = dto.Mileage,
                PurchasePrice = dto.PurchasePrice,
                TaxAmount = dto.TaxAmount,
                TransportPrice = dto.TransportPrice,
                AuctionPrice = dto.AuctionPrice,
                Year = dto.Year,
                ModelId = dto.ModelId,
            });
        }


        public async Task UpdateCar(int id, CarDto dto, List<FileData> images)
        {
            var carWithImages = await _unitOfWork.CarRepository.GetById(id, false, true);

            if (carWithImages != null)
                _fileStorage.DeleteFiles(carWithImages.ImageUrls);

            var savedNames = await _fileStorage.SaveFilesAsync(images, Constants.CARS_IMAGES_FOLDER);

            await _unitOfWork.CarRepository.Update(id, new CarEntity
            {
                AuctionId = dto.AuctionId,
                ChassisNumber = dto.ChasisNumber,
                ColorId = dto.ColorId,
                EngineVolume = dto.EngineVolume,
                FinalPrice = dto.FinalPrice,
                FuelType = dto.FuelType,
                ImageUrls = savedNames.ToArray(),
                Mileage = dto.Mileage,
                PurchasePrice = dto.PurchasePrice,
                TransportPrice = dto.TransportPrice,
                AuctionPrice = dto.AuctionPrice,
                TaxAmount = dto.TaxAmount,
                Year = dto.Year,
                ModelId = dto.ModelId,
            });
        }


        public async Task DeleteCar(int id)
        {
            var car = await _unitOfWork.CarRepository.GetById(id, false, true);
            if (car == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            if (car.ImageUrls.Any())
                _fileStorage.DeleteFiles(car.ImageUrls);

            await _unitOfWork.CarRepository.Delete(id);
        }


        public async Task<CarDto?> GetCarById(int id)
        {
            var car = await _unitOfWork.CarRepository.GetById(id, true, true);

            if (car == null)
                return null;

            return new CarDto
            {
                CarId = car.CarId,
                AuctionId = car.AuctionId,
                BrandId = car.BrandId,
                BrandName = car.BrandName,
                ModelName = car.ModelName,
                ColorName = car.ColorName,
                FinalPrice = car.FinalPrice,
                PurchasePrice = car.PurchasePrice,
                TaxAmount = car.TaxAmount,
                TransportPrice = car.TransportPrice,
                AuctionPrice = car.AuctionPrice,
                Year = car.Year,
                CreatedAt = car.CreatedDate,
                Images = car.ImageUrls,
                ColorId = car.ColorId,
                ModelId = car.ModelId,
                ChasisNumber = car.ChassisNumber,
                Mileage = car.Mileage,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
            };
        }
    }
}
