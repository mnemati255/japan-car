using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Common;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Services
{
    public class CarService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorage _fileStorage;

        public CarService(IUnitOfWork unitOfWork, IFileStorage fileStorage)
        {
            _unitOfWork = unitOfWork;
            _fileStorage = fileStorage;
        }


        public async Task<IEnumerable<CarDto>> GetAllCars()
        {
            var cars = await _unitOfWork.CarRepository.GetAll();
            return cars.Select(x => new CarDto
            {
                ColorName = x.ColorName,
                Mileage = x.Mileage,
                ModelName = x.ModelName,
                Year = x.Year
            });
        }


        public async Task<IEnumerable<CarDto>> GetAllCarsOfAuction(int auctionId)
        {
            var cars = await _unitOfWork.CarRepository.GetAllCarsOfAuction(auctionId);

            return cars.Select(x => new CarDto
            {
                CarId = x.CarId,
                AuctionId = auctionId,
                BrandName = x.BrandName,
                ModelName = x.ModelName,
                ColorName = x.ColorName,
                FinalPrice = x.FinalPrice,
                PurchasePrice = x.PurchasePrice,
                TaxAmount = x.TaxAmount,
                Year = x.Year,
                CreatedAt = x.CreatedDate,
                Images = x.ImageUrls
            });
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
                TechnicalTestResult = dto.TechnicalTestResult,
                UsageStatus = dto.UsageStatus,
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
                TaxAmount = dto.TaxAmount,
                TechnicalTestResult = dto.TechnicalTestResult,
                UsageStatus = dto.UsageStatus,
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
                BrandName = car.BrandName,
                ModelName = car.ModelName,
                ColorName = car.ColorName,
                FinalPrice = car.FinalPrice,
                PurchasePrice = car.PurchasePrice,
                TaxAmount = car.TaxAmount,
                Year = car.Year,
                CreatedAt = car.CreatedDate,
                Images = car.ImageUrls,
                ColorId = car.ColorId,
                ModelId = car.ModelId,
                ChasisNumber = car.ChassisNumber,
                Mileage = car.Mileage,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                TechnicalTestResult = car.TechnicalTestResult,
                UsageStatus = car.UsageStatus
            };
        }
    }
}
